#!/usr/bin/env python3
"""
Minimal Flask server to serve a TensorFlow/Keras CNN model for X-ray prediction.

Usage:
  1. Place your trained Keras model file as `model.h5` or a SavedModel directory named `model_saved` in the same folder.
  2. Create a Python venv and install requirements: `pip install -r requirements.txt`
  3. Run: `python predict_server.py`

Endpoint:
  POST /predict  - accepts multipart/form-data with field `image` (PNG/JPG)
                   returns JSON { diseases: [ { key, name, icon, severity, confidence, symptoms, precautions, recommendations } ] }
  POST /send-registration-email - accepts JSON with email and name for registration confirmation

This example shows how to load a model and run inference. Replace preprocessing and label-mapping with your actual model logic.
"""
from flask import Flask, request, jsonify
from flask_cors import CORS
import io
import os
from PIL import Image
import numpy as np
from datetime import datetime
import smtplib
from email.message import EmailMessage
import cv2

app = Flask(__name__)
CORS(app)

# Try to import TensorFlow, but fail gracefully if not installed
try:
    import tensorflow as tf
except Exception as e:
    tf = None

# Dummy label map - replace with your model's mapping
LABELS = [
    'cavity', 'gingivitis', 'periodontitis', 'plaque', 'tartar', 'erosion', 'discoloration', 'crack'
]

# (Optional) load a Keras model if available
MODEL = None
if tf is not None:
    # prefer SavedModel directory 'model_saved' or Keras H5 'model.h5'
    if os.path.isdir('model_saved'):
        try:
            MODEL = tf.keras.models.load_model('model_saved')
            print('Loaded SavedModel from model_saved')
        except Exception:
            MODEL = None
    elif os.path.isfile('model.h5'):
        try:
            MODEL = tf.keras.models.load_model('model.h5')
            print('Loaded Keras model from model.h5')
        except Exception:
            MODEL = None


def preprocess_image(img: Image.Image, target_size=(224, 224)) -> np.ndarray:
    """Resize, convert to RGB and normalize image to feed model. Adjust to your model's expected input."""
    if img.mode != 'RGB':
        img = img.convert('RGB')
    img = img.resize(target_size)
    arr = np.asarray(img).astype('float32') / 255.0
    arr = np.expand_dims(arr, axis=0)  # batch dimension
    return arr


def detect_teeth_in_image(img_array: np.ndarray) -> dict:
    """
    Detect if teeth are present in the image using edge detection and contour analysis.
    Returns a dict with:
    - 'has_teeth': bool - whether teeth were detected
    - 'confidence': float - confidence score 0-1
    - 'message': str - status message
    """
    try:
        # Convert to grayscale
        gray = cv2.cvtColor(img_array, cv2.COLOR_RGB2GRAY)
        
        # Apply CLAHE (Contrast Limited Adaptive Histogram Equalization) for better tooth visibility
        clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8, 8))
        enhanced = clahe.apply(gray)
        
        # Apply Gaussian blur to reduce noise
        blurred = cv2.GaussianBlur(enhanced, (5, 5), 0)
        
        # Edge detection using Canny
        edges = cv2.Canny(blurred, 50, 150)
        
        # Apply morphological operations to strengthen edges
        kernel = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (5, 5))
        closed = cv2.morphologyEx(edges, cv2.MORPH_CLOSE, kernel)
        
        # Find contours
        contours, _ = cv2.findContours(closed, cv2.RETR_TREE, cv2.CHAIN_APPROX_SIMPLE)
        
        if len(contours) == 0:
            return {
                'has_teeth': False,
                'confidence': 0.0,
                'message': 'No teeth detected in the image. Please upload a clear image of teeth or a dental X-ray.'
            }
        
        # Filter contours by area (teeth should have significant area)
        valid_contours = []
        h, w = enhanced.shape
        min_area = (h * w) * 0.01  # Minimum 1% of image area
        max_area = (h * w) * 0.9   # Maximum 90% of image area
        
        for contour in contours:
            area = cv2.contourArea(contour)
            if min_area < area < max_area:
                valid_contours.append(contour)
        
        if len(valid_contours) == 0:
            return {
                'has_teeth': False,
                'confidence': 0.0,
                'message': 'No valid tooth structure detected. Please ensure the image shows teeth clearly.'
            }
        
        # Analyze teeth characteristics
        teeth_characteristics = 0
        
        for contour in valid_contours:
            # Check contour shape (teeth have specific morphological features)
            area = cv2.contourArea(contour)
            perimeter = cv2.arcLength(contour, True)
            
            if perimeter == 0:
                continue
                
            # Circularity check (teeth are somewhat elongated)
            circularity = 4 * np.pi * area / (perimeter ** 2)
            
            # Teeth typically have circularity between 0.3 and 0.95
            if 0.3 < circularity < 0.95:
                teeth_characteristics += 1
        
        # Calculate confidence based on number of tooth-like structures detected
        total_valid = len(valid_contours)
        teeth_ratio = teeth_characteristics / max(1, total_valid)
        
        # Require at least 40% of contours to look like teeth
        if teeth_ratio >= 0.4:
            confidence = min(0.95, teeth_ratio + 0.3)
            return {
                'has_teeth': True,
                'confidence': float(np.round(confidence, 2)),
                'message': 'Teeth detected successfully'
            }
        else:
            return {
                'has_teeth': False,
                'confidence': float(np.round(teeth_ratio, 2)),
                'message': 'Image does not appear to contain teeth. Please upload a dental X-ray or clear image of teeth.'
            }
    
    except Exception as e:
        print(f"Error in teeth detection: {str(e)}")
        return {
            'has_teeth': False,
            'confidence': 0.0,
            'message': 'Error analyzing image. Please try again with a clearer image.'
        }


@app.route('/predict', methods=['POST'])
def predict():
    # If a real ML model isn't available, provide a simulated prediction
    # so the frontend (camera upload) can be tested without TensorFlow.
    if MODEL is None:
        if 'image' not in request.files:
            return jsonify({ 'error': 'No image provided' }), 400

        f = request.files['image']
        try:
            img = Image.open(io.BytesIO(f.read()))
        except Exception:
            return jsonify({ 'error': 'Invalid image file. Please upload a valid image.' }), 400

        img_array = np.asarray(img)
        if len(img_array.shape) == 2:  # Grayscale
            img_array = cv2.cvtColor(img_array, cv2.COLOR_GRAY2RGB)
        elif img_array.shape[2] == 4:  # RGBA
            img_array = cv2.cvtColor(img_array, cv2.COLOR_RGBA2RGB)

        teeth_detection = detect_teeth_in_image(img_array)
        if not teeth_detection['has_teeth']:
            return jsonify({
                'error': teeth_detection['message'],
                'teeth_detected': False,
                'confidence': teeth_detection['confidence']
            }), 400

        # Simulate predictions
        import random
        num = random.choice([1, 1, 2])
        chosen = list(np.random.choice(LABELS, size=num, replace=False))
        diseases = []
        for label in chosen:
            confidence = float(np.round(random.uniform(0.5, 0.95) * 100.0, 2))
            diseases.append({
                'key': label,
                'name': label.replace('_', ' ').title(),
                'icon': '🦷',
                'severity': random.choice(['low', 'medium', 'high', 'critical']),
                'confidence': confidence,
                'symptoms': ['Simulated symptom: consult dentist for confirmation.'],
                'precautions': ['Maintain oral hygiene', 'Visit dentist if symptoms persist'],
                'recommendations': ['Schedule a dental appointment'],
                'teeth_detected': True,
                'image_quality': teeth_detection['confidence']
            })

        return jsonify({
            'diseases': diseases,
            'teeth_detected': True,
            'image_quality_score': teeth_detection['confidence']
        }), 200

    if 'image' not in request.files:
        return jsonify({ 'error': 'No image provided' }), 400

    f = request.files['image']
    try:
        img = Image.open(io.BytesIO(f.read()))
    except Exception:
        return jsonify({ 'error': 'Invalid image file. Please upload a valid image.' }), 400

    # Convert PIL image to numpy array for processing
    img_array = np.asarray(img)
    
    # Ensure RGB format for teeth detection
    if len(img_array.shape) == 2:  # Grayscale
        img_array = cv2.cvtColor(img_array, cv2.COLOR_GRAY2RGB)
    elif img_array.shape[2] == 4:  # RGBA
        img_array = cv2.cvtColor(img_array, cv2.COLOR_RGBA2RGB)
    
    # Detect teeth in the image
    teeth_detection = detect_teeth_in_image(img_array)
    
    # If no teeth detected, return error
    if not teeth_detection['has_teeth']:
        return jsonify({
            'error': teeth_detection['message'],
            'teeth_detected': False,
            'confidence': teeth_detection['confidence']
        }), 400

    # Proceed with disease detection
    x = preprocess_image(img, target_size=(224, 224))

    # run inference
    preds = MODEL.predict(x)

    # If model outputs probabilities per label
    if preds.ndim == 2 and preds.shape[0] == 1:
        probs = preds[0]
    else:
        # fallback - reshape
        probs = np.ravel(preds)

    # map top predictions to diseaseDatabase-like structure
    top_idx = probs.argsort()[::-1][:3]
    diseases = []
    for idx in top_idx:
        label = LABELS[idx] if idx < len(LABELS) else f'label_{idx}'
        confidence = float(np.round(float(probs[idx] * 100.0), 2))
        
        # Filter out very low confidence predictions
        if confidence < 25:
            continue
        
        # Minimal info - customize per-label details from a server-side DB
        item = {
            'key': label,
            'name': label.replace('_', ' ').title(),
            'icon': '🦷',
            'severity': 'medium',
            'confidence': confidence,
            'symptoms': ['See dental professional for diagnosis.'],
            'precautions': ['Maintain oral hygiene', 'Visit dentist'],
            'recommendations': ['Schedule a dental appointment'],
            'teeth_detected': True,
            'image_quality': teeth_detection['confidence']
        }
        diseases.append(item)

    # Return results with teeth detection info
    return jsonify({
        'diseases': diseases,
        'teeth_detected': True,
        'image_quality_score': teeth_detection['confidence']
    })


@app.route('/send-registration-email', methods=['POST'])
def send_registration_email():
    """Send registration confirmation email to new user."""
    try:
        data = request.get_json()
        user_email = data.get('email', '').strip()
        user_name = data.get('name', 'User').strip()
        
        if not user_email:
            return jsonify({'success': False, 'message': 'Email is required'}), 400
        
        # Create email content
        subject = "Welcome to ORAL CARE-X-AI! 🦷"
        
        html_body = f"""
        <html>
            <body style="font-family: Arial, sans-serif; background-color: #061428; color: #ffffff; padding: 20px;">
                <div style="background: linear-gradient(135deg, #0066cc 0%, #0052a3 100%); padding: 30px; border-radius: 10px; text-align: center; margin-bottom: 20px;">
                    <h1 style="margin: 0; font-size: 28px;">🦷 ORAL CARE-X-AI</h1>
                    <p style="margin: 5px 0 0 0; font-size: 14px; opacity: 0.9;">Advanced AI-Powered Dental Diagnostics</p>
                </div>
                
                <div style="background-color: rgba(255,255,255,0.05); padding: 20px; border-radius: 8px; border-left: 4px solid #00d4ff;">
                    <h2 style="color: #00d4ff; margin-top: 0;">Welcome, {user_name}! 👋</h2>
                    
                    <p style="font-size: 16px; line-height: 1.6;">
                        Thank you for registering with <strong>ORAL CARE-X-AI</strong>!
                    </p>
                    
                    <p style="font-size: 16px; line-height: 1.6;">
                        Your account has been successfully created. You are now part of our community of users who trust AI-powered dental diagnostics for their oral health analysis.
                    </p>
                    
                    <div style="background-color: rgba(0, 212, 255, 0.1); padding: 15px; border-radius: 6px; margin: 20px 0;">
                        <h3 style="color: #00d4ff; margin-top: 0;">Account Details:</h3>
                        <p style="margin: 8px 0;"><strong>Email:</strong> {user_email}</p>
                        <p style="margin: 8px 0;"><strong>Account Status:</strong> <span style="color: #00ff88;">✅ Active</span></p>
                        <p style="font-size: 14px; color: rgba(255,255,255,0.8); margin: 8px 0;">You can now log in immediately using your credentials.</p>
                    </div>
                    
                    <h3 style="color: #00d4ff;">What's Next?</h3>
                    <ul style="font-size: 15px; line-height: 1.8;">
                        <li>Wait for admin approval (typically within 24 hours)</li>
                        <li>You'll receive another email once your account is approved</li>
                        <li>Then you can login and start using our AI diagnostics</li>
                    </ul>
                    
                    <h3 style="color: #00ff88;">Features You'll Get:</h3>
                    <ul style="font-size: 15px; line-height: 1.8;">
                        <li>✅ AI-Powered Dental Disease Detection</li>
                        <li>✅ Instant Image Analysis</li>
                        <li>✅ Comprehensive Health Reports</li>
                        <li>✅ 24/7 Customer Support</li>
                        <li>✅ Secure & Private Data Storage</li>
                    </ul>
                    
                    <p style="font-size: 14px; color: rgba(255,255,255,0.7); margin-top: 20px;">
                        If you have any questions, feel free to contact us at <strong>sameeyabanu986@gmail.com</strong>
                    </p>
                </div>
                
                <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid rgba(255,255,255,0.1); font-size: 12px; color: rgba(255,255,255,0.5);">
                    <p>© 2026 ORAL CARE-X-AI. All rights reserved.</p>
                    <p>Advanced Dental Diagnostics using CNN Algorithm</p>
                </div>
            </body>
        </html>
        """
        
        # For now, simulate email sending with a log
        with open('registrations.log', 'a') as f:
            f.write(f"[{datetime.now()}] Registration confirmation sent to: {user_email} (Name: {user_name})\n")
        
        print(f"✓ Registration email queued for: {user_email}")
        
        return jsonify({
            'success': True, 
            'message': f'Registration confirmation sent to {user_email}! Please check your email and wait for admin approval.',
            'email': user_email
        }), 200
        
    except Exception as e:
        print(f"Error sending registration email: {str(e)}")
        return jsonify({
            'success': False,
            'message': 'Failed to send registration email, but your account has been created.'
        }), 200  # Return 200 anyway so registration continues


@app.route('/send-contact', methods=['POST'])
def send_contact():
    """Receive contact form submissions. Logs them to disk and optionally sends an email if SMTP env vars are configured."""
    try:
        data = request.get_json() or {}
        name = data.get('name', '').strip()
        email_addr = data.get('email', '').strip()
        subject = data.get('subject', 'Contact from ORAL CARE-X-AI').strip()
        message = data.get('message', '').strip()

        if not (name and email_addr and message):
            return jsonify({'success': False, 'message': 'name, email and message are required'}), 400

        # Append to contacts log
        log_line = f"[{datetime.now()}] Contact from: {name} <{email_addr}> Subject: {subject} Message: {message}\n"
        with open('contacts.log', 'a', encoding='utf-8') as f:
            f.write(log_line)

        # Try to send email if SMTP settings are provided via environment
        smtp_host = os.environ.get('SMTP_HOST')
        smtp_port = int(os.environ.get('SMTP_PORT') or 0)
        smtp_user = os.environ.get('SMTP_USER')
        smtp_pass = os.environ.get('SMTP_PASS')
        contact_recipient = os.environ.get('CONTACT_RECIPIENT', 'sameeyabanu986@gmail.com')

        if smtp_host and smtp_port and smtp_user and smtp_pass:
            try:
                email_msg = EmailMessage()
                email_msg['Subject'] = f"Website Contact: {subject}"
                email_msg['From'] = smtp_user
                email_msg['To'] = contact_recipient
                email_msg.set_content(f"Name: {name}\nEmail: {email_addr}\n\nMessage:\n{message}")
                email_msg.add_alternative(f"<p><strong>Name:</strong> {name}<br><strong>Email:</strong> {email_addr}</p><p>{message}</p>", subtype='html')

                with smtplib.SMTP(smtp_host, smtp_port, timeout=10) as smtp:
                    smtp.starttls()
                    smtp.login(smtp_user, smtp_pass)
                    smtp.send_message(email_msg)

                with open('contacts.log', 'a', encoding='utf-8') as f:
                    f.write(f"[{datetime.now()}] Email delivered to {contact_recipient}\n")
            except Exception as e:
                print(f"Failed to send contact email: {e}")
                with open('contacts.log', 'a', encoding='utf-8') as f:
                    f.write(f"[{datetime.now()}] Failed to send contact email: {e}\n")

        return jsonify({'success': True, 'message': 'Contact submission received. Thank you!'}), 200

    except Exception as e:
        print(f"Error in send_contact: {e}")
        return jsonify({'success': False, 'message': 'Server error while processing contact form.'}), 500


if __name__ == '__main__':
    print('Starting predict_server. MODEL loaded:', MODEL is not None)
    app.run(host='0.0.0.0', port=5000, debug=True)
