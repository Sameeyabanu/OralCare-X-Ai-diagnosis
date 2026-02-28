// ===============================================
// ORAL CARE AI - X-ray Analysis System
// ===============================================

// Disease Database with symptoms, precautions and recommendations
const diseaseDatabase = {
    cavity: {
        name: 'Dental Cavity (Caries)',
        icon: '🦷',
        severity: 'high',
        confidence: 85,
        symptoms: [
            'Pain when eating or drinking',
            'Visible hole in tooth',
            'Brown or black staining',
            'Sharp pain when biting'
        ],
        precautions: [
            'Brush teeth twice daily with fluoride toothpaste',
            'Floss daily to remove food particles',
            'Limit sugary foods and drinks',
            'Use fluoride mouthwash',
            'Visit dentist every 6 months',
            'Avoid acidic beverages',
            'Stop smoking and tobacco use'
        ],
        recommendations: [
            'Schedule immediate dental appointment',
            'Fluoride treatment may be needed',
            'Possible filling or crown restoration',
            'Improve oral hygiene routine',
            'Consider dental sealants for prevention'
        ]
    },
    
    gingivitis: {
        name: 'Gingivitis (Gum Disease)',
        icon: '🩸',
        severity: 'medium',
        confidence: 78,
        symptoms: [
            'Swollen or puffy gums',
            'Bleeding while brushing',
            'Red or dark red gums',
            'Persistent bad breath'
        ],
        precautions: [
            'Brush gently with soft-bristled brush',
            'Floss daily to remove plaque',
            'Use antiseptic mouthwash',
            'Avoid smoking and tobacco',
            'Reduce stress levels',
            'Eat vitamin C rich foods',
            'Professional cleaning by dentist'
        ],
        recommendations: [
            'Deep cleaning (scaling and root planing)',
            'Professional fluoride treatment',
            'Antimicrobial mouthwash usage',
            'Improve brushing technique',
            'Regular dental check-ups every 3 months'
        ]
    },

    periodontitis: {
        name: 'Periodontitis (Advanced Gum Disease)',
        icon: '🔬',
        severity: 'critical',
        confidence: 82,
        symptoms: [
            'Receding gums',
            'Loose or shifting teeth',
            'Pus between teeth and gums',
            'Painful chewing',
            'Severe bad breath'
        ],
        precautions: [
            'Strict oral hygiene routine',
            'Quit smoking immediately',
            'Use antimicrobial rinse daily',
            'Professional cleaning every 3 months',
            'Take antibiotics if prescribed',
            'Manage stress and diet',
            'Regular dental monitoring'
        ],
        recommendations: [
            'Urgent appointment with periodontist',
            'Scaling and root planing',
            'Possible antibiotic therapy',
            'Bone grafting may be required',
            'Implants if teeth loss occurs',
            'Frequent follow-up appointments'
        ]
    },

    plaque: {
        name: 'Plaque Buildup',
        icon: '⚠️',
        severity: 'medium',
        confidence: 88,
        symptoms: [
            'Sticky film on teeth',
            'Tooth discoloration',
            'Bad breath',
            'Gum sensitivity'
        ],
        precautions: [
            'Brush twice daily for 2 minutes',
            'Use electric toothbrush',
            'Floss daily',
            'Water irrigation device usage',
            'Reduce sugar consumption',
            'Professional cleaning annually'
        ],
        recommendations: [
            'Professional plaque removal',
            'Ultrasonic cleaning',
            'Fluoride treatment',
            'Improve home care routine',
            'Education on proper brushing'
        ]
    },

    tartar: {
        name: 'Tartar Accumulation',
        icon: '🪨',
        severity: 'medium',
        confidence: 80,
        symptoms: [
            'Hard, crusty deposits on teeth',
            'Yellow or brown staining',
            'Bad breath',
            'Gum irritation'
        ],
        precautions: [
            'Professional cleaning twice yearly',
            'Daily brushing with tartar control paste',
            'Dental flossing',
            'Water flosser usage',
            'Regular dental check-ups',
            'Avoid staining foods and drinks'
        ],
        recommendations: [
            'Professional tartar removal',
            'Scaling procedure',
            'Fluoride application',
            'Tartar control toothpaste',
            'More frequent cleanings'
        ]
    },

    erosion: {
        name: 'Tooth Erosion',
        icon: '⚡',
        severity: 'high',
        confidence: 75,
        symptoms: [
            'Worn, flat tooth surface',
            'Yellowing teeth',
            'Increased sensitivity',
            'Rounded edges on teeth'
        ],
        precautions: [
            'Avoid acidic foods and drinks',
            'Drink water after acidic intake',
            'Use fluoride mouthwash',
            'Don\'t brush immediately after acidic foods',
            'Wear mouthguard if grinding',
            'Manage GERD if present'
        ],
        recommendations: [
            'Bonding treatment',
            'Crown placement if severe',
            'Fluoride gel application',
            'Protective sealants',
            'Dietary modification consultation'
        ]
    },

    discoloration: {
        name: 'Tooth Discoloration',
        icon: '🎨',
        severity: 'low',
        confidence: 82,
        symptoms: [
            'Yellow or brown tooth color',
            'Uneven tooth coloring',
            'Surface staining'
        ],
        precautions: [
            'Regular brushing and flossing',
            'Limit coffee and red wine',
            'Avoid smoking and tobacco',
            'Professional cleaning',
            'Whitening toothpaste usage'
        ],
        recommendations: [
            'Professional teeth whitening',
            'Cosmetic veneer placement',
            'Bleaching treatment',
            'Lifestyle modifications',
            'Regular polishing appointments'
        ]
    },

    crack: {
        name: 'Tooth Crack or Fracture',
        icon: '💔',
        severity: 'high',
        confidence: 79,
        symptoms: [
            'Visible crack in tooth',
            'Pain when biting',
            'Sensitivity to temperature',
            'Swelling around tooth'
        ],
        precautions: [
            'Avoid chewing hard objects',
            'Wear protective mouthguard during sports',
            'Don\'t grind teeth (use nightguard)',
            'Avoid temperature extremes',
            'Gentle chewing on other side'
        ],
        recommendations: [
            'Immediate dental evaluation',
            'Bonding or filling',
            'Root canal if nerve exposed',
            'Crown placement',
            'Extraction if severely damaged'
        ]
    }
};

// Simulate AI Analysis
function analyzeXray(imageFile) {
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = function (e) {
            // Simulate AI processing delay
            setTimeout(() => {
                // Generate random disease detection (in real implementation, use ML model)
                const diseases = getRandomDiseases();
                resolve(diseases);
            }, 2000);
        };
        reader.readAsArrayBuffer(imageFile);
    });
}

// Get random diseases for demo
function getRandomDiseases() {
    const diseaseKeys = Object.keys(diseaseDatabase);
    const numDiseases = Math.floor(Math.random() * 3) + 1; // 1-3 diseases
    const selectedDiseases = [];

    for (let i = 0; i < numDiseases; i++) {
        const randomKey = diseaseKeys[Math.floor(Math.random() * diseaseKeys.length)];
        if (!selectedDiseases.find(d => d.key === randomKey)) {
            selectedDiseases.push({
                key: randomKey,
                ...diseaseDatabase[randomKey],
                confidence: diseaseDatabase[randomKey].confidence + Math.floor(Math.random() * 15) - 7
            });
        }
    }

    return selectedDiseases;
}

// Handle file upload
function handleFileSelect(event) {
    const file = event.target.files[0];
    if (file) {
        processFile(file);
    }
}

// Handle drag and drop
function handleDragOver(event) {
    event.preventDefault();
    event.stopPropagation();
    document.getElementById('upload-area').classList.add('drag-over');
}

function handleDragLeave(event) {
    event.preventDefault();
    event.stopPropagation();
    document.getElementById('upload-area').classList.remove('drag-over');
}

function handleDrop(event) {
    event.preventDefault();
    event.stopPropagation();
    document.getElementById('upload-area').classList.remove('drag-over');

    const files = event.dataTransfer.files;
    if (files.length > 0) {
        const file = files[0];
        if (file.type.startsWith('image/')) {
            document.getElementById('xray-input').files = files;
            processFile(file);
        } else {
            alert('Please upload an image file');
        }
    }
}

// --- Camera support ---
let cameraStream = null;
const videoEl = () => document.getElementById('camera-video');

async function startCamera() {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        alert('Camera API not supported in this browser');
        return;
    }
    try {
        cameraStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' }, audio: false });
        const v = videoEl();
        if (v) {
            v.srcObject = cameraStream;
            document.getElementById('camera-container').style.display = 'block';
            document.getElementById('upload-area').classList.add('hidden');
        }
    } catch (err) {
        console.error('Camera error', err);
        alert('Unable to access camera: ' + (err.message || err));
    }
}

function stopCamera() {
    if (cameraStream) {
        cameraStream.getTracks().forEach(t => t.stop());
        cameraStream = null;
    }
    const v = videoEl();
    if (v) {
        v.srcObject = null;
    }
    const camContainer = document.getElementById('camera-container');
    if (camContainer) camContainer.style.display = 'none';
    document.getElementById('upload-area').classList.remove('hidden');
}

function toggleCamera() {
    if (cameraStream) stopCamera(); else startCamera();
}

function captureCamera() {
    const v = videoEl();
    if (!v || !cameraStream) { alert('Camera not started'); return; }

    const canvas = document.createElement('canvas');
    canvas.width = v.videoWidth || 640;
    canvas.height = v.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(v, 0, 0, canvas.width, canvas.height);

    canvas.toBlob(blob => {
        if (!blob) { alert('Capture failed'); return; }
        const file = new File([blob], 'capture.png', { type: 'image/png' });
        // stop camera automatically after capture
        stopCamera();
        processFile(file);
    }, 'image/png');
}


// Process uploaded file
function processFile(file) {
    // Validate file size (10MB)
    if (file.size > 10 * 1024 * 1024) {
        alert('File size exceeds 10MB limit. Please choose a smaller file.');
        return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
        alert('Please upload a valid image file (PNG, JPG, WebP, etc.)');
        return;
    }

    // Show preview
    const reader = new FileReader();
    reader.onload = function (e) {
        document.getElementById('preview-image').src = e.target.result;
        showLoadingAnimation();
        
        // Always try server-side prediction first
        sendToServer(file);
    };
    reader.readAsDataURL(file);
}

// Send image file to server-side CNN endpoint. Returns true if server responded with results.
async function sendToServer(file) {
    const url = (typeof API_BASE !== 'undefined' ? API_BASE : window.location.origin) + '/predict';
    try {
        const fd = new FormData();
        fd.append('image', file);

        const res = await fetch(url, { method: 'POST', body: fd });
        const data = await res.json().catch(() => null);

        if (!res.ok) {
            // Handle error responses
            if (data && data.error) {
                displayErrorMessage(data.error, data.image_quality);
            } else {
                displayErrorMessage('Server error. Please try again.', 0);
            }
            return true; // Return true to prevent fallback simulation
        }

        if (!data || !data.diseases) {
            displayErrorMessage('No disease detected in the image or invalid response from server.', 0);
            return true;
        }

        // Check if teeth were detected
        if (data.teeth_detected === false) {
            displayErrorMessage(
                'Teeth not detected in the image. Please ensure you upload:\n' +
                '• A clear dental X-ray image\n' +
                '• A well-lit photo of your teeth\n' +
                '• Only the teeth area (no heavy background objects)',
                data.image_quality_score || 0
            );
            return true;
        }

        // Display results with quality score
        displayResults(data.diseases);
        
        // Show image quality indicator
        if (data.image_quality_score !== undefined) {
            displayImageQuality(data.image_quality_score);
        }
        
        return true;
    } catch (err) {
        console.warn('Server prediction failed', err);
        displayErrorMessage('Unable to connect to server. Please check your connection and try again.', 0);
        return true;
    }
}

// Show loading animation
function showLoadingAnimation() {
    document.getElementById('upload-area').classList.add('hidden');
    document.getElementById('results-panel').style.display = 'block';
    
    const diseaseResults = document.getElementById('disease-results');
    diseaseResults.innerHTML = `
        <div class="loading-animation">
            <div class="spinner"></div>
            <p data-lang="analyze_processing">Analyzing X-ray... Detecting teeth and diseases</p>
        </div>
    `;
}

// Display error message when teeth not detected or analysis fails
function displayErrorMessage(message, imageQuality) {
    const diseaseResults = document.getElementById('disease-results');
    
    let qualityInfo = '';
    if (imageQuality !== undefined && imageQuality > 0) {
        qualityInfo = `<p style="margin-top: 15px; padding: 10px; background-color: rgba(255,165,0,0.1); border-left: 3px solid #ff9500; border-radius: 4px;">
            <strong>Image Quality Score:</strong> ${(imageQuality * 100).toFixed(1)}%
        </p>`;
    }
    
    diseaseResults.innerHTML = `
        <div style="background: linear-gradient(135deg, #ff6b6b, #ee5a52); padding: 30px; border-radius: 12px; text-align: center; color: white;">
            <div style="font-size: 48px; margin-bottom: 15px;">⚠️</div>
            <h3 style="margin: 15px 0; font-size: 20px;">Analysis Could Not Be Completed</h3>
            <p style="margin: 15px 0; font-size: 16px; line-height: 1.6;">${message}</p>
            ${qualityInfo}
            <div style="margin-top: 25px; padding-top: 25px; border-top: 1px solid rgba(255,255,255,0.3);">
                <h4 style="margin: 0 0 15px 0; color: #fff;">✅ Tips for a Better Analysis:</h4>
                <ul style="text-align: left; display: inline-block; margin: 0; padding: 0; max-width: 400px;">
                    <li style="margin: 8px 0; line-height: 1.4;">📸 Use a high-resolution image or official dental X-ray</li>
                    <li style="margin: 8px 0; line-height: 1.4;">💡 Ensure good lighting - teeth should be clearly visible</li>
                    <li style="margin: 8px 0; line-height: 1.4;">🎯 Frame only the teeth area, minimize background</li>
                    <li style="margin: 8px 0; line-height: 1.4;">📐 Keep the image straight and well-focused</li>
                    <li style="margin: 8px 0; line-height: 1.4;">🗂️ Remove any objects blocking the teeth</li>
                </ul>
            </div>
        </div>
    `;
}

// Display image quality score
function displayImageQuality(quality) {
    const qualityPercent = Math.round(quality * 100);
    const qualityBar = document.querySelector('.quality-score-bar');
    
    if (!qualityBar) {
        const resultsPanel = document.getElementById('results-panel');
        if (resultsPanel) {
            const qualityDiv = document.createElement('div');
            qualityDiv.style.cssText = 'padding: 15px; background: rgba(0,0,0,0.1); border-radius: 8px; margin-bottom: 20px;';
            qualityDiv.innerHTML = `
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                    <strong>Image Quality:</strong>
                    <span>${qualityPercent}%</span>
                </div>
                <div class="quality-score-bar" style="width: 100%; height: 8px; background: #ddd; border-radius: 4px; overflow: hidden;">
                    <div style="height: 100%; background: linear-gradient(90deg, #4ade80, #22c55e); width: ${qualityPercent}%; transition: width 0.3s ease;"></div>
                </div>
            `;
            resultsPanel.insertBefore(qualityDiv, resultsPanel.firstChild);
        }
    }
}

// Display analysis results
function displayResults(diseases) {
    // Calculate overall confidence
    const avgConfidence = Math.round(diseases.reduce((acc, d) => acc + d.confidence, 0) / diseases.length);
    
    // Display detected diseases
    const diseaseResults = document.getElementById('disease-results');
    
    // Add a success header
    let successHeader = `
        <div style="background: linear-gradient(135deg, #4ade80, #22c55e); padding: 20px; border-radius: 12px; margin-bottom: 20px; color: white; text-align: center;">
            <div style="font-size: 36px; margin-bottom: 10px;">✅</div>
            <h3 style="margin: 0; font-size: 18px;">Teeth Detected Successfully</h3>
            <p style="margin: 5px 0 0 0; opacity: 0.9;">AI analysis complete - See results below</p>
        </div>
    `;
    
    diseaseResults.innerHTML = successHeader + diseases.map(disease => `
        <div class="disease-result ${disease.severity}">
            <div class="disease-header">
                <span class="disease-icon">${disease.icon}</span>
                <div class="disease-info">
                    <h4>${disease.name}</h4>
                    <div class="severity-indicator">
                        <span class="severity-badge severity-${disease.severity}">${disease.severity.toUpperCase()}</span>
                        <span class="confidence">Confidence: ${disease.confidence}%</span>
                    </div>
                </div>
                <button class="info-btn" onclick="showDiseaseDetails('${disease.key}')" title="More info">ℹ️</button>
            </div>
            <div class="disease-details">
                <p><strong>Symptoms:</strong></p>
                <ul>
                    ${disease.symptoms.map(symptom => `<li>${symptom}</li>`).join('')}
                </ul>
            </div>
        </div>
    `).join('');

    // Update confidence meter
    const confidenceBar = document.getElementById('confidence-bar');
    const confidenceText = document.getElementById('confidence-text');
    confidenceBar.style.width = avgConfidence + '%';
    confidenceText.textContent = avgConfidence + '%';
    
    // Set color based on confidence
    if (avgConfidence >= 80) {
        confidenceBar.style.background = 'linear-gradient(90deg, #4ade80, #22c55e)';
    } else if (avgConfidence >= 60) {
        confidenceBar.style.background = 'linear-gradient(90deg, #facc15, #eab308)';
    } else {
        confidenceBar.style.background = 'linear-gradient(90deg, #f87171, #ef4444)';
    }

    // Combine and display recommendations
    const allRecommendations = new Set();
    diseases.forEach(disease => {
        disease.recommendations.forEach(rec => allRecommendations.add(rec));
    });
    
    const recommendationsHtml = document.getElementById('recommendations');
    recommendationsHtml.innerHTML = Array.from(allRecommendations).map(rec => `
        <div class="recommendation-item">
            <span class="icon">💡</span>
            <p>${rec}</p>
        </div>
    `).join('');

    // Combine and display precautions
    const allPrecautions = new Set();
    diseases.forEach(disease => {
        disease.precautions.forEach(prec => allPrecautions.add(prec));
    });
    
    const precautionsHtml = document.getElementById('precautions');
    precautionsHtml.innerHTML = Array.from(allPrecautions).map(prec => `
        <div class="precaution-item">
            <span class="icon">✓</span>
            <p>${prec}</p>
        </div>
    `).join('');

    // Determine overall severity
    const maxSeverity = getMaxSeverity(diseases.map(d => d.severity));
    const severityBadge = document.getElementById('severity-badge');
    severityBadge.className = `severity-badge severity-${maxSeverity}`;
    severityBadge.textContent = maxSeverity.toUpperCase();

    // Store current analysis for report download
    window.currentAnalysis = {
        diseases: diseases,
        confidence: avgConfidence,
        timestamp: new Date().toLocaleString(),
        teeth_detected: true
    };
}

// Get max severity level
function getMaxSeverity(severities) {
    const severityLevels = { critical: 3, high: 2, medium: 1, low: 0 };
    let maxSeverity = 'low';
    let maxLevel = 0;
    
    severities.forEach(severity => {
        if (severityLevels[severity] > maxLevel) {
            maxLevel = severityLevels[severity];
            maxSeverity = severity;
        }
    });
    
    return maxSeverity;
}

// Show disease details in modal
function showDiseaseDetails(diseaseKey) {
    const disease = diseaseDatabase[diseaseKey];
    const modal = document.getElementById('disease-modal');
    const modalContent = document.getElementById('modal-disease-info');
    
    modalContent.innerHTML = `
        <h2>${disease.icon} ${disease.name}</h2>
        
        <div class="modal-section">
            <h3>Symptoms</h3>
            <ul class="symptoms-list">
                ${disease.symptoms.map(symptom => `<li>${symptom}</li>`).join('')}
            </ul>
        </div>

        <div class="modal-section">
            <h3>Recommendations</h3>
            <ul class="recommendations-list">
                ${disease.recommendations.map(rec => `<li>💡 ${rec}</li>`).join('')}
            </ul>
        </div>

        <div class="modal-section">
            <h3>Preventive Precautions</h3>
            <ul class="precautions-list">
                ${disease.precautions.map(prec => `<li>✓ ${prec}</li>`).join('')}
            </ul>
        </div>
    `;
    
    modal.style.display = 'block';
}

// Close disease details modal
function closeDiseaseModal() {
    document.getElementById('disease-modal').style.display = 'none';
}

// Book appointment
function bookAppointment() {
    window.location.href = 'appointment.html?fromAnalysis=true';
}

// Download report as PDF (simulated)
function downloadReport() {
    if (!window.currentAnalysis) return;

    const analysis = window.currentAnalysis;
    let reportContent = 'ORAL CARE AI - DENTAL X-RAY ANALYSIS REPORT\n';
    reportContent += '==========================================\n\n';
    reportContent += `Analysis Date: ${analysis.timestamp}\n`;
    reportContent += `Overall Confidence: ${analysis.confidence}%\n\n`;

    reportContent += 'DETECTED ISSUES:\n';
    reportContent += '----------------\n';
    analysis.diseases.forEach(disease => {
        reportContent += `\n${disease.name}\n`;
        reportContent += `Severity: ${disease.severity.toUpperCase()}\n`;
        reportContent += `Confidence: ${disease.confidence}%\n`;
    });

    // Create text file and download
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(reportContent));
    element.setAttribute('download', `dental_report_${new Date().getTime()}.txt`);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);

    alert('Report downloaded successfully!');
}

// Reset analysis
function resetAnalysis() {
    document.getElementById('upload-area').classList.remove('hidden');
    document.getElementById('results-panel').style.display = 'none';
    document.getElementById('xray-input').value = '';
    document.getElementById('preview-image').src = '';
    
    // Remove quality score display if it exists
    const qualityDiv = document.querySelector('.quality-score-bar');
    if (qualityDiv && qualityDiv.parentElement) {
        qualityDiv.parentElement.remove();
    }
}

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('disease-modal');
    if (event.target == modal) {
        modal.style.display = 'none';
    }
}

// Toggle mobile menu
function toggleMobileMenu() {
    const navLinks = document.querySelector('.nav-links');
    if (navLinks) {
        navLinks.classList.toggle('active');
    }
}
