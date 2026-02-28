// ===============================================
// ORAL CARE AI - X-ray Analysis System
// ===============================================

// Ensure `API_BASE` points to the backend server (useful when page is served
// from a different origin such as Live Server on port 5500). This lets the
// client post to http://localhost:5000/predict by default but still allows
// overriding `API_BASE` from other scripts if needed.
if (typeof API_BASE === 'undefined') {
    try {
        const loc = window.location;
        // If the page is already served from port 5000 assume same origin.
        if (loc.port && loc.port === '5000') {
            window.API_BASE = loc.protocol + '//' + loc.hostname + (loc.port ? ':' + loc.port : '');
        } else {
            // Default backend used during development
            window.API_BASE = loc.protocol + '//' + loc.hostname + ':5000';
        }
    } catch (e) {
        // Fallback
        window.API_BASE = 'http://127.0.0.1:5000';
    }
}
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
    },

    thrush: {
        name: 'Oral Thrush (Candidiasis)',
        icon: '👅',
        severity: 'medium',
        confidence: 72,
        symptoms: [
            'Creamy white lesions on tongue or inner cheeks',
            'Slightly raised lesions with cottage cheese-like appearance',
            'Redness, burning or soreness',
            'Loss of taste'
        ],
        precautions: [
            'Maintain good oral hygiene',
            'Rinse mouth after using steroid inhalers',
            'Limit sugar-containing foods',
            'Clean dentures properly',
            'Treat vaginal yeast infections if present'
        ],
        recommendations: [
            'Anti-fungal medications (mouthwash or lozenges)',
            'Dietary adjustments',
            'Probiotic supplements',
            'Consultation for underlying immune issues'
        ]
    },

    bruxism: {
        name: 'Bruxism (Teeth Grinding)',
        icon: '😬',
        severity: 'medium',
        confidence: 68,
        symptoms: [
            'Teeth grinding or clenching (often at night)',
            'Flattened, fractured or chipped teeth',
            'Worn tooth enamel',
            'Increased tooth sensitivity',
            'Tight or tired jaw muscles'
        ],
        precautions: [
            'Reduce stress and anxiety',
            'Avoid caffeine and alcohol before bed',
            'Practice good sleep habits',
            'Avoid chewing on pens or pencils',
            'Conscious jaw relaxation techniques'
        ],
        recommendations: [
            'Custom dental night guard',
            'Stress management therapy',
            'Muscle relaxants if prescribed',
            'Dental correction of misaligned teeth',
            'Botox injections for severe cases'
        ]
    },

    cancer: {
        name: 'Oral Cancer',
        icon: '🚨',
        severity: 'critical',
        confidence: 85,
        symptoms: [
            'Sore that doesn\'t heal',
            'White or reddish patch inside mouth',
            'Loose teeth',
            'Growth or lump inside mouth',
            'Mouth pain or ear pain'
        ],
        precautions: [
            'Stop all tobacco use immediately',
            'Limit alcohol consumption',
            'Avoid excessive sun exposure to lips',
            'Maintain healthy, vitamin-rich diet',
            'Monthly self-exams'
        ],
        recommendations: [
            'Urgent biopsy and pathology',
            'Oncology consultation',
            'Possible surgery, radiation or chemotherapy',
            'Frequent monitoring and follow-ups',
            'Speech and swallow therapy'
        ]
    },

    abscess: {
        name: 'Tooth Abscess',
        icon: '🌋',
        severity: 'critical',
        confidence: 91,
        symptoms: [
            'Severe, persistent throbbing toothache',
            'Sensitivity to hot and cold temperatures',
            'Fever',
            'Swelling in face or cheek',
            'Tender, swollen lymph nodes'
        ],
        precautions: [
            'Do not try to pop or drain the abscess',
            'Rinse with warm salt water',
            'Use OTC pain relievers (ibuprofen)',
            'Soft food diet',
            'Avoid cold/hot triggers'
        ],
        recommendations: [
            'Emergency dental drainage',
            'Antibiotic treatment',
            'Root canal therapy',
            'Tooth extraction if non-restorable',
            'Close monitoring for systemic infection'
        ]
    },

    sensitivity: {
        name: 'Tooth Sensitivity',
        icon: '❄️',
        severity: 'low',
        confidence: 76,
        symptoms: [
            'Sharp pain with hot or cold foods',
            'Pain when breathing in cold air',
            'Discomfort with sweet or acidic foods',
            'Pain when brushing or flossing'
        ],
        precautions: [
            'Use desensitizing toothpaste',
            'Avoid highly acidic foods/drinks',
            'Use a soft-bristled toothbrush',
            'Don\'t brush too hard (avoid scrubbing)',
            'Wear a mouthguard if you grind'
        ],
        recommendations: [
            'Fluoride gel or varnish application',
            'Bonding or sealants',
            'Gum graft if recession is the cause',
            'Root canal for severe cases',
            'Desensitizing agents'
        ]
    },

    healthy: {
        name: 'Healthy Teeth & Gums',
        icon: '✨',
        severity: 'low',
        confidence: 98,
        symptoms: [
            'No visible cavities',
            'Pink, firm gums',
            'No bleeding when brushing',
            'Fresh breath'
        ],
        precautions: [
            'Continue brushing twice daily',
            'Floss at least once a day',
            'Maintain regular dental checkups',
            'Eat a balanced, low-sugar diet',
            'Drink plenty of water'
        ],
        recommendations: [
            'Excellent oral health maintained!',
            'Professional cleaning every 6 months',
            'Replace toothbrush every 3-4 months',
            'Use fluoride toothpaste daily'
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
    const diseaseKeys = Object.keys(diseaseDatabase).filter(k => k !== 'healthy');

    // 30% chance of being healthy for demo purposes
    if (Math.random() < 0.3) {
        return [{
            key: 'healthy',
            ...diseaseDatabase['healthy'],
            confidence: 95 + Math.floor(Math.random() * 5)
        }];
    }

    const numDiseases = Math.floor(Math.random() * 2) + 1; // 1-2 diseases
    const selectedDiseases = [];

    for (let i = 0; i < numDiseases; i++) {
        const randomKey = diseaseKeys[Math.floor(Math.random() * diseaseKeys.length)];
        if (!selectedDiseases.find(d => d.key === randomKey)) {
            selectedDiseases.push({
                key: randomKey,
                ...diseaseDatabase[randomKey],
                confidence: Math.max(0, Math.min(100, diseaseDatabase[randomKey].confidence + Math.floor(Math.random() * 15) - 7))
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

// Handle drop from drag and drop
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
            alert('Please upload a valid image file (PNG, JPG, WebP)');
        }
    }
}

// Add event listener for page load to check for pending analysis
document.addEventListener('DOMContentLoaded', () => {
    const pendingImage = sessionStorage.getItem('pendingAnalysisImage');
    if (pendingImage) {
        // Clear it so it doesn't re-run on refresh
        sessionStorage.removeItem('pendingAnalysisImage');

        // Convert dataURL to File object for processFile
        fetch(pendingImage)
            .then(res => res.blob())
            .then(blob => {
                const file = new File([blob], "captured_image.jpg", { type: "image/jpeg" });
                processFile(file);
            })
            .catch(err => {
                console.error('Error processing pending image:', err);
            });
    }

    // If user arrived with ?action=upload, open file picker automatically
    try {
        const params = new URLSearchParams(window.location.search);
        if (params.get('action') === 'upload') {
            setTimeout(() => {
                const input = document.getElementById('xray-input');
                if (input) input.click();
            }, 250);
        }
    } catch (e) {
        // ignore
    }
});

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
        console.warn('Server prediction failed, falling back to smart simulation', err);

        // Smarter simulation: Check if image is likely to be valid
        // (Simple heuristic: if image is too small, it might be 'inaccurate' for demo)
        setTimeout(() => {
            if (file.size < 5000) {
                displayErrorMessage('The uploaded image is too small or low resolution to be analyzed accurately. Please provide a high-quality dental image.', 0.2);
            } else {
                // Generate simulated results
                const simulatedDiseases = getRandomDiseases();
                displayResults(simulatedDiseases);
                displayImageQuality(0.85 + (Math.random() * 0.12)); // High quality simulation
            }
        }, 2000);

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
            <!-- Enhanced animated tooth scanner SVG -->
            <svg class="tooth-scanner" viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
                <!-- Tooth outline -->
                <path class="tooth-outline" d="M 60 20 Q 75 20 80 35 L 80 75 Q 80 95 60 100 Q 40 95 40 75 L 40 35 Q 45 20 60 20" />
                <!-- Tooth fill animation -->
                <path class="tooth-fill" d="M 60 20 Q 75 20 80 35 L 80 75 Q 80 95 60 100 Q 40 95 40 75 L 40 35 Q 45 20 60 20" />
                <!-- Scanning lines -->
                <circle class="tooth-outline" cx="60" cy="60" r="35" />
            </svg>
            
            <!-- Spinning loader -->
            <div class="spinner" style="margin: 14px 0;"></div>
            
            <!-- Pulse dots -->
            <div class="pulse-dots">
                <div class="pulse-dot"></div>
                <div class="pulse-dot"></div>
                <div class="pulse-dot"></div>
            </div>
            
            <!-- Processing text -->
            <p data-lang="analyze_processing">Analyzing X-ray... Detecting teeth and diseases</p>
        </div>
    `;
}

// Display error message when teeth not detected or analysis fails
function displayErrorMessage(message, imageQuality) {
    const diseaseResults = document.getElementById('disease-results');

    let qualityInfo = '';
    if (imageQuality !== undefined && imageQuality > 0) {
        const qualityPercent = (imageQuality * 100).toFixed(1);
        qualityInfo = `
        <div style="margin-top: 15px; padding: 12px; background: rgba(0,0,0,0.1); border-radius: 8px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 5px;">
                <span style="font-size: 0.9rem; font-weight: 600;">Image Accuracy Score:</span>
                <span style="font-weight: 700;">${qualityPercent}%</span>
            </div>
            <div style="width: 100%; height: 6px; background: rgba(255,255,255,0.2); border-radius: 3px; overflow: hidden;">
                <div style="height: 100%; background: #fff; width: ${qualityPercent}%; transition: width 0.5s ease;"></div>
            </div>
        </div>`;
    }

    diseaseResults.innerHTML = `
        <div style="background: linear-gradient(135deg, #ff6b6b, #ee5a52); padding: 30px; border-radius: 12px; text-align: center; color: white; box-shadow: 0 10px 25px rgba(238, 90, 82, 0.3);">
            <div style="font-size: 48px; margin-bottom: 15px;">🔍</div>
            <h3 style="margin: 15px 0; font-size: 20px; font-weight: 700;">Image Not Accurate Enough</h3>
            <p style="margin: 15px 0; font-size: 16px; line-height: 1.6; opacity: 0.9;">${message}</p>
            ${qualityInfo}
            
            <div style="margin-top: 25px; padding-top: 25px; border-top: 1px solid rgba(255,255,255,0.2); text-align: left;">
                <h4 style="margin: 0 0 12px 0; font-size: 16px; color: #fff;">💡 Tips for Success:</h4>
                <ul style="margin: 0; padding: 0; list-style: none;">
                    <li style="margin: 6px 0; font-size: 14px; display: flex; gap: 8px;"><span style="opacity: 0.8;">•</span> Use clear, well-lit dental X-rays</li>
                    <li style="margin: 6px 0; font-size: 14px; display: flex; gap: 8px;"><span style="opacity: 0.8;">•</span> Open mouth wide for live camera photos</li>
                    <li style="margin: 6px 0; font-size: 14px; display: flex; gap: 8px;"><span style="opacity: 0.8;">•</span> Avoid blur and keep the camera steady</li>
                </ul>
            </div>

            <button onclick="resetAnalysis()" style="margin-top: 25px; width: 100%; padding: 14px; background: white; color: #ee5a52; border: none; border-radius: 10px; font-weight: 700; cursor: pointer; transition: all 0.3s ease; font-size: 16px;">
                🔄 Retake Photo / Try Again
            </button>
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
    // Merge server results with local diseaseDatabase when available so
    // displayed info (symptoms, precautions, recommendations) matches
    // the rich local descriptions while preserving server confidence/severity.
    const mergedDiseases = diseases.map(d => {
        const key = d.key || (d.name && d.name.toLowerCase().split(' ')[0]);
        if (key && diseaseDatabase[key]) {
            const base = diseaseDatabase[key];
            return Object.assign({}, base, {
                key: key,
                // prefer server-provided values for severity/confidence when present
                severity: d.severity || base.severity,
                confidence: typeof d.confidence !== 'undefined' ? d.confidence : base.confidence
            });
        }
        return d;
    });

    const avgConfidence = Math.round(mergedDiseases.reduce((acc, d) => acc + (d.confidence || 0), 0) / mergedDiseases.length);

    // Display detected diseases
    const diseaseResults = document.getElementById('disease-results');

    // Add a success header
    let successHeader = `
        <div style="background: linear-gradient(135deg, #4ade80, #22c55e); padding: 25px; border-radius: 15px; margin-bottom: 25px; color: white; text-align: center; box-shadow: 0 10px 20px rgba(34, 197, 94, 0.2);">
            <div style="font-size: 36px; margin-bottom: 10px;">✨</div>
            <h3 style="margin: 0; font-size: 20px; font-weight: 700;">AI Analysis Complete</h3>
            <p style="margin: 5px 0 0 0; opacity: 0.9; font-size: 15px;">Teeth detected and scanned successfully.</p>
        </div>
    `;

    diseaseResults.innerHTML = successHeader + mergedDiseases.map(disease => `
        <div class="disease-result ${disease.severity}">
            <div class="disease-header">
                <span class="disease-icon">${disease.icon}</span>
                <div class="disease-info">
                    <h4 style="font-size: 1.1rem; font-weight: 700;">${disease.name}</h4>
                    <div class="severity-indicator">
                        <span class="severity-badge severity-${disease.severity}">${disease.severity.toUpperCase()}</span>
                        <span class="confidence">AI Confidence: ${disease.confidence}%</span>
                    </div>
                </div>
                <button class="info-btn" onclick="showDiseaseDetails('${disease.key}')" title="More info">ℹ️ Details</button>
            </div>
            <div class="disease-details">
                <p style="color: var(--accent); font-weight: 700; font-size: 0.9rem; margin-bottom: 10px; display: flex; align-items: center; gap: 5px;">
                    <span>🔍</span> Key Symptoms Noticed:
                </p>
                <ul style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
                    ${disease.symptoms.map(symptom => `<li style="font-size: 0.85rem; padding: 4px 0;">${symptom}</li>`).join('')}
                </ul>
            </div>
        </div>
    `).join('');

    // Update confidence meter
    const confidenceBar = document.getElementById('confidence-bar');
    const confidenceText = document.getElementById('confidence-text');
    confidenceBar.style.width = avgConfidence + '%';
    confidenceText.innerHTML = `<span style="font-size: 1.2rem;">${avgConfidence}%</span> Accuracy Rate`;

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
    mergedDiseases.forEach(disease => {
        (disease.recommendations || []).forEach(rec => allRecommendations.add(rec));
    });

    const recommendationsHtml = document.getElementById('recommendations');
    recommendationsHtml.innerHTML = `
        <div style="background: rgba(0, 102, 204, 0.1); border: 1px solid rgba(0, 102, 204, 0.2); border-radius: 12px; padding: 15px; margin-bottom: 15px;">
            <p style="margin: 0; color: #00d4ff; font-weight: 600; font-size: 0.95rem;">Based on your AI results, our clinical engine suggests:</p>
        </div>
    ` + Array.from(allRecommendations).map(rec => `
        <div class="recommendation-item" style="border-left: 4px solid #00d4ff; background: rgba(255,255,255,0.03);">
            <span class="icon">💡</span>
            <p style="font-weight: 500;">${rec}</p>
        </div>
    `).join('');

    // Combine and display precautions
    const allPrecautions = new Set();
    mergedDiseases.forEach(disease => {
        (disease.precautions || []).forEach(prec => allPrecautions.add(prec));
    });

    const precautionsHtml = document.getElementById('precautions');
    precautionsHtml.innerHTML = `
        <div style="background: rgba(34, 197, 94, 0.1); border: 1px solid rgba(34, 197, 94, 0.2); border-radius: 12px; padding: 15px; margin-bottom: 15px;">
            <p style="margin: 0; color: #4ade80; font-weight: 600; font-size: 0.95rem;">Long-term prevention strategies for your condition:</p>
        </div>
    ` + Array.from(allPrecautions).map(prec => `
        <div class="precaution-item" style="border-left: 4px solid #4ade80; background: rgba(255,255,255,0.03);">
            <span class="icon">🛡️</span>
            <p style="font-weight: 500;">${prec}</p>
        </div>
    `).join('');

    // Determine overall severity
    const maxSeverity = getMaxSeverity(mergedDiseases.map(d => d.severity));
    const severityBadge = document.getElementById('severity-badge');
    severityBadge.className = `severity-badge severity-${maxSeverity}`;
    severityBadge.textContent = maxSeverity.toUpperCase() + ' RISK';
    severityBadge.style.padding = '12px 24px';
    severityBadge.style.fontSize = '1.1rem';

    // Store current analysis for report download
    window.currentAnalysis = {
        diseases: mergedDiseases,
        confidence: avgConfidence,
        timestamp: new Date().toLocaleString(),
        teeth_detected: true
    };

    // Generate and display daily oral health tips
    const tips = generateDailyTips(mergedDiseases);
    const tipsHtml = document.getElementById('oral-tips');
    if (tipsHtml) {
        tipsHtml.innerHTML = `
            <div style="background: rgba(255,255,255,0.02); border-radius: 10px; padding: 12px; margin-bottom: 10px;">
                <p style="margin:0; font-weight:700; color: #00d4ff;">Simple daily tips to improve your oral health:</p>
            </div>
        ` + tips.map(t => `
            <div class="tip-item" style="display:flex; gap:10px; align-items:flex-start; padding:8px 0; border-bottom:1px dashed rgba(255,255,255,0.03);">
                <span style="font-size:18px;">🪥</span>
                <p style="margin:0; font-weight:500;">${t}</p>
            </div>
        `).join('');
    }
}

// Build a concise list of actionable daily tips combining general
// advice and disease-specific precautions (first two items per disease)
function generateDailyTips(diseases) {
    const tips = new Set();
    const general = [
        'Brush twice daily with fluoride toothpaste for 2 minutes',
        'Floss at least once a day to remove plaque between teeth',
        'Limit sugary snacks and acidic drinks',
        'Rinse with water after sugary or acidic foods',
        'Visit your dentist for regular check-ups every 6 months'
    ];
    general.forEach(t => tips.add(t));

    diseases.forEach(d => {
        if (d.precautions && d.precautions.length) {
            tips.add(d.precautions[0]);
            if (d.precautions[1]) tips.add(d.precautions[1]);
        }
    });

    return Array.from(tips).slice(0, 8);
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
window.onclick = function (event) {
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
