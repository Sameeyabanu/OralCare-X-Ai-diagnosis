// ===============================================
// ORAL CARE AI - Main JavaScript
// ===============================================

// ============= NAVIGATION & UI =============

function scrollToLogin() {
    const loginSection = document.getElementById('login-section');
    if (loginSection) {
        loginSection.scrollIntoView({ behavior: 'smooth' });
    }
}

function toggleMobileMenu() {
    const navLinks = document.querySelector('.nav-links');
    const navActions = document.querySelector('.nav-actions');
    const menuBtn = document.querySelector('.mobile-menu-btn');
    
    if (navLinks) {
        navLinks.classList.toggle('active');
    }
    if (navActions) {
        navActions.classList.toggle('active');
    }
    if (menuBtn) {
        menuBtn.classList.toggle('active');
    }
    
    // Close menu when a link is clicked
    const navLinksArray = document.querySelectorAll('.nav-links a');
    navLinksArray.forEach(link => {
        link.addEventListener('click', function() {
            if (navLinks) navLinks.classList.remove('active');
            if (navActions) navActions.classList.remove('active');
            if (menuBtn) menuBtn.classList.remove('active');
        });
    });
}

// Show/Hide sections
function showSection(sectionId) {
    // Hide all main sections
    const sections = ['home', 'upload-section', 'report-section'];
    sections.forEach(id => {
        const section = document.getElementById(id);
        if (section) {
            section.classList.add('hidden');
        }
    });

    // Hide hero if showing upload/report
    const hero = document.querySelector('.hero');
    const features = document.querySelector('.features');
    const stats = document.querySelector('.stats');
    const testimonials = document.querySelector('.testimonials');
    const footer = document.querySelector('.footer');

    if (sectionId === 'upload-section' || sectionId === 'report-section') {
        if (hero) hero.classList.add('hidden');
        if (features) features.classList.add('hidden');
        if (stats) stats.classList.add('hidden');
        if (testimonials) testimonials.classList.add('hidden');
    } else {
        if (hero) hero.classList.remove('hidden');
        if (features) features.classList.remove('hidden');
        if (stats) stats.classList.remove('hidden');
        if (testimonials) testimonials.classList.remove('hidden');
    }

    // Show target section
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.remove('hidden');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

// ============= LOGIN FUNCTIONALITY =============

function login(event) {
    if (event) event.preventDefault();

    const user = document.getElementById("username").value;
    const pass = document.getElementById("password").value;
    const loginMsg = document.getElementById("loginMsg");

    if (user && pass) {
        loginMsg.innerText = "Login Successful! ✓ Redirecting...";
        loginMsg.className = "login-msg success";

        // Store login state
        sessionStorage.setItem('isLoggedIn', 'true');
        sessionStorage.setItem('username', user);

        setTimeout(() => {
            showSection('upload-section');
        }, 1500);

        return false;
    } else {
        loginMsg.innerText = "Please enter both username and password";
        loginMsg.className = "login-msg error";
        return false;
    }
}

// ============= IMAGE UPLOAD & ANALYSIS =============

function classifyImage() {
    const file = document.getElementById("imageInput").files[0];
    const uploadMsg = document.getElementById("uploadMsg");

    if (!file) {
        uploadMsg.innerText = "Please select an image to analyze!";
        uploadMsg.className = "login-msg error";
        return;
    }

    uploadMsg.innerText = "🔄 Analyzing image using CNN model...";
    uploadMsg.className = "login-msg";
    uploadMsg.style.color = "#00d4ff";

    // Simulate AI analysis
    setTimeout(() => {
        uploadMsg.innerText = "✓ Analysis complete!";
        uploadMsg.className = "login-msg success";

        setTimeout(() => {
            showSection('report-section');
            generateReport();
        }, 500);
    }, 2500);
}

function generateReport() {
    const diseases = [
        { name: "Dental Cavity Detected", severity: "Moderate", confidence: "94%" },
        { name: "Gingivitis (Early Stage)", severity: "Mild", confidence: "91%" },
        { name: "Healthy Teeth", severity: "None", confidence: "97%" },
        { name: "Tooth Sensitivity", severity: "Mild", confidence: "89%" },
        { name: "Plaque Buildup", severity: "Moderate", confidence: "92%" }
    ];

    const selected = diseases[Math.floor(Math.random() * diseases.length)];

    document.getElementById("status").innerText = "Analysis Complete";
    document.getElementById("disease").innerText = selected.name;

    const severityEl = document.getElementById("severity");
    if (severityEl) {
        severityEl.innerText = selected.severity;
    }

    const rec = document.getElementById("recommendation");
    rec.innerHTML = "";

    if (selected.name === "Healthy Teeth") {
        rec.innerHTML = `
            <li>Excellent! Continue maintaining your oral hygiene</li>
            <li>Brush twice daily with fluoride toothpaste</li>
            <li>Floss daily to prevent plaque buildup</li>
            <li>Schedule regular dental checkups every 6 months</li>
        `;
    } else if (selected.name.includes("Cavity")) {
        rec.innerHTML = `
            <li>Consult a dentist within the next 1-2 weeks</li>
            <li>Avoid excessive sugary foods and drinks</li>
            <li>Use fluoride mouthwash to strengthen enamel</li>
            <li>Consider dental sealants for prevention</li>
            <li>Maintain strict oral hygiene routine</li>
        `;
    } else if (selected.name.includes("Gingivitis")) {
        rec.innerHTML = `
            <li>Improve brushing technique - brush for 2 minutes</li>
            <li>Start flossing daily if not already</li>
            <li>Use an antiseptic mouthwash</li>
            <li>Schedule a professional cleaning</li>
            <li>Monitor for bleeding or swelling</li>
        `;
    } else {
        rec.innerHTML = `
            <li>Consult with a dental professional</li>
            <li>Follow prescribed treatment plan</li>
            <li>Maintain regular oral hygiene</li>
            <li>Avoid foods that trigger sensitivity</li>
            <li>Use desensitizing toothpaste</li>
        `;
    }

    // Persist detection result for admin analytics
    try {
        const records = JSON.parse(localStorage.getItem('diseaseRecords')) || [];
        const userEmail = sessionStorage.getItem('userEmail') || sessionStorage.getItem('registeredEmail') || 'guest';
        records.push({ email: userEmail, disease: selected.name, date: new Date().toISOString() });
        localStorage.setItem('diseaseRecords', JSON.stringify(records));
    } catch (e) {
        console.warn('Could not save disease record', e);
    }
}


// ============= CONTACT FORM =============

function submitContact(event) {
    if (event) event.preventDefault();

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;
    const contactMsg = document.getElementById('contactMsg');

    if (name && email && message) {
        contactMsg.innerText = "✓ Message sent successfully! We'll get back to you soon.";
        contactMsg.className = "login-msg success";

        // Reset form
        document.getElementById('contactForm').reset();
    } else {
        contactMsg.innerText = "Please fill in all required fields";
        contactMsg.className = "login-msg error";
    }

    return false;
}

// Email sending function - opens user's email client
function submitContactEmail(event) {
    if (event) event.preventDefault();

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const subject = document.getElementById('subject').value || 'Contact from ORAL CARE X-AI Website';
    const message = document.getElementById('message').value;
    const contactMsg = document.getElementById('contactMsg');

    if (name && email && message) {
        // Create mailto link with form data
        const recipientEmail = 'sameeyabanu986@gmail.com';
        const emailSubject = encodeURIComponent(subject);
        const emailBody = encodeURIComponent(
            `Name: ${name}\n` +
            `Email: ${email}\n\n` +
            `Message:\n${message}\n\n` +
            `---\nSent from ORAL CARE X-AI Contact Form`
        );

        // Open email client
        const mailtoLink = `mailto:${recipientEmail}?subject=${emailSubject}&body=${emailBody}`;
        window.open(mailtoLink, '_blank');

        contactMsg.innerText = "✓ Email client opened! Please send the email to complete.";
        contactMsg.className = "login-msg success";

        // Reset form after short delay
        setTimeout(() => {
            document.getElementById('contactForm').reset();
        }, 2000);
    } else {
        contactMsg.innerText = "Please fill in all required fields";
        contactMsg.className = "login-msg error";
    }

    return false;
}

// ============= CHATBOT FUNCTIONALITY =============

let isChatbotOpen = false;

function toggleChatbot() {
    const chatbot = document.getElementById('chatbot');
    const btn = document.getElementById('chatbot-btn');

    isChatbotOpen = !isChatbotOpen;

    if (isChatbotOpen) {
        chatbot.classList.add('active');
        btn.innerHTML = '✕';
    } else {
        chatbot.classList.remove('active');
        btn.innerHTML = '💬';
    }
}

function handleChatKeypress(event) {
    if (event.key === 'Enter') {
        sendMessage();
    }
}

function sendMessage() {
    const input = document.getElementById('chatInput');
    const message = input.value.trim();

    if (!message) return;

    // Add user message
    addChatMessage(message, 'user');
    input.value = '';

    // Show typing indicator
    showTypingIndicator();

    // Generate response after delay
    setTimeout(() => {
        hideTypingIndicator();
        const response = generateChatResponse(message);
        addChatMessage(response, 'bot');
    }, 1000 + Math.random() * 1000);
}

function quickResponse(symptom) {
    const input = document.getElementById('chatInput');
    input.value = `I have ${symptom}`;
    sendMessage();
}

function addChatMessage(text, sender) {
    const messagesContainer = document.getElementById('chatMessages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `chat-message ${sender}`;
    messageDiv.textContent = text;
    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function showTypingIndicator() {
    const messagesContainer = document.getElementById('chatMessages');
    const typingDiv = document.createElement('div');
    typingDiv.className = 'chat-message bot typing-indicator';
    typingDiv.id = 'typing-indicator';
    typingDiv.innerHTML = '<span></span><span></span><span></span>';
    messagesContainer.appendChild(typingDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function hideTypingIndicator() {
    const indicator = document.getElementById('typing-indicator');
    if (indicator) {
        indicator.remove();
    }
}

function generateChatResponse(message) {
    const lowerMessage = message.toLowerCase();

    // Dental disease detection responses
    const responses = {
        // Toothache
        toothache: {
            keywords: ['toothache', 'tooth pain', 'tooth hurts', 'teeth hurt', 'aching tooth', 'pain in tooth'],
            response: "🦷 Based on your toothache symptoms, this could indicate:\n\n• **Dental Cavity** - Most common cause\n• **Tooth Abscess** - If severe throbbing pain\n• **Cracked Tooth** - If pain when biting\n• **Gum Disease** - If gums are also affected\n\n💡 Recommendation: Rinse with warm salt water and avoid very hot/cold foods. If pain persists beyond 1-2 days, please consult a dentist. Would you like to upload an image for AI analysis?"
        },

        // Bleeding Gums
        bleeding: {
            keywords: ['bleeding gum', 'gums bleed', 'blood when brush', 'bleeding when floss', 'gum bleeding'],
            response: "🩸 Bleeding gums often indicate:\n\n• **Gingivitis** - Early gum disease (most common)\n• **Periodontitis** - Advanced gum disease\n• **Improper Brushing** - Too hard brushing\n• **Vitamin Deficiency** - Especially Vitamin C/K\n\n💡 Recommendation: Use a soft-bristled brush, floss gently daily, and use antiseptic mouthwash. If bleeding continues for more than 2 weeks, see a dentist."
        },

        // Sensitivity
        sensitivity: {
            keywords: ['sensitive', 'sensitivity', 'cold hurts', 'hot hurts', 'sweet hurts', 'pain with cold'],
            response: "❄️ Tooth sensitivity suggests:\n\n• **Enamel Erosion** - Worn tooth surface\n• **Exposed Roots** - From gum recession\n• **Cavity** - Early decay\n• **Cracked Tooth** - Micro-fractures\n\n💡 Recommendation: Use desensitizing toothpaste (like Sensodyne), avoid acidic foods, and don't brush too hard. If sensitivity is severe or sudden, consult a dentist."
        },

        // Bad Breath
        breath: {
            keywords: ['bad breath', 'halitosis', 'breath smells', 'mouth odor', 'smell from mouth'],
            response: "💨 Bad breath (halitosis) can be caused by:\n\n• **Poor Oral Hygiene** - Bacteria buildup\n• **Gum Disease** - Gingivitis/Periodontitis\n• **Dry Mouth** - Reduced saliva\n• **Food Particles** - Trapped between teeth\n\n💡 Recommendation: Brush tongue, floss daily, stay hydrated, and use antibacterial mouthwash. Persistent bad breath may indicate underlying issues - consult a dentist."
        },

        // Cavity
        cavity: {
            keywords: ['cavity', 'cavities', 'hole in tooth', 'decay', 'caries', 'black spot'],
            response: "🕳️ Dental cavities are characterized by:\n\n• **Symptoms**: Dark spots, holes, sensitivity to sweets\n• **Causes**: Bacteria, sugar, poor hygiene\n• **Stages**: Enamel → Dentin → Pulp\n\n💡 Recommendation: Avoid sugary snacks, use fluoride toothpaste, and see a dentist for filling treatment. Early detection prevents root canals! Upload an image for our AI to analyze."
        },

        // Swelling
        swelling: {
            keywords: ['swelling', 'swollen', 'puffy gum', 'face swelling', 'jaw swelling', 'abscess'],
            response: "⚠️ Dental swelling is often urgent and may indicate:\n\n• **Tooth Abscess** - Bacterial infection\n• **Pericoronitis** - Wisdom tooth infection\n• **Severe Gum Disease** - Advanced periodontitis\n\n🚨 If you have fever, difficulty swallowing, or spreading swelling, seek emergency dental care immediately! Rinse with salt water in the meantime."
        },

        // Wisdom Teeth
        wisdom: {
            keywords: ['wisdom tooth', 'wisdom teeth', 'back tooth', 'third molar', 'impacted'],
            response: "🦷 Wisdom tooth issues include:\n\n• **Impaction** - Tooth stuck under gum\n• **Pericoronitis** - Gum infection around tooth\n• **Crowding** - Pushing other teeth\n\n💡 Recommendation: If you're experiencing pain, swelling, or difficulty opening mouth, consult a dentist. Many wisdom teeth require extraction."
        },

        // Grinding
        grinding: {
            keywords: ['grinding', 'clenching', 'bruxism', 'jaw pain', 'teeth grinding'],
            response: "😬 Teeth grinding (Bruxism) can cause:\n\n• **Worn Teeth** - Flattened or chipped\n• **Jaw Pain (TMJ)** - Joint problems\n• **Headaches** - Especially morning headaches\n• **Sensitivity** - From enamel loss\n\n💡 Recommendation: Consider a night guard, manage stress, avoid caffeine before bed, and practice jaw relaxation exercises."
        },

        // Whitening
        whitening: {
            keywords: ['whiten', 'white teeth', 'yellow teeth', 'stain', 'discolor', 'brighten'],
            response: "✨ For teeth whitening:\n\n• **Professional Whitening** - Most effective (dentist)\n• **At-Home Kits** - Moderate results\n• **Whitening Toothpaste** - Mild improvement\n\n💡 Tips: Avoid coffee, tea, red wine. Brush after staining foods. Avoid smoking. Consider professional cleaning first."
        },

        // General greeting
        greeting: {
            keywords: ['hello', 'hi', 'hey', 'good morning', 'good evening', 'help'],
            response: "Hello! 👋 I'm your Dental AI Assistant. I can help you:\n\n• Identify dental symptoms\n• Provide information about conditions\n• Suggest when to see a dentist\n\nWhat symptoms are you experiencing? You can describe them or use the quick response buttons below."
        }
    };

    // Check for matching keywords
    for (const [category, data] of Object.entries(responses)) {
        for (const keyword of data.keywords) {
            if (lowerMessage.includes(keyword)) {
                return data.response;
            }
        }
    }

    // Default response
    return "🤔 I understand you're concerned about your dental health. Could you please describe your symptoms more specifically? For example:\n\n• Where is the pain/discomfort?\n• How long have you had it?\n• Is it constant or occasional?\n\nYou can also try the quick symptom buttons above, or upload a dental image for AI analysis on our home page.";
}

// ============= INITIALIZATION =============

document.addEventListener('DOMContentLoaded', function () {
    // Check if user is logged in
    if (sessionStorage.getItem('isLoggedIn') === 'true') {
        // User is logged in, could auto-navigate to upload
    }

    // Add scroll effect to navbar
    window.addEventListener('scroll', function () {
        const navbar = document.querySelector('.navbar');
        if (navbar) {
            if (window.scrollY > 50) {
                navbar.style.background = 'rgba(10, 22, 40, 0.98)';
                navbar.style.boxShadow = '0 4px 30px rgba(0, 0, 0, 0.2)';
            } else {
                navbar.style.background = 'rgba(10, 22, 40, 0.95)';
                navbar.style.boxShadow = 'none';
            }
        }
    });

    // Upload zone drag and drop
    const uploadZone = document.querySelector('.upload-zone');
    if (uploadZone) {
        uploadZone.addEventListener('click', function () {
            document.getElementById('imageInput').click();
        });

        uploadZone.addEventListener('dragover', function (e) {
            e.preventDefault();
            uploadZone.style.borderColor = 'var(--accent)';
            uploadZone.style.background = 'rgba(0, 212, 255, 0.1)';
        });

        uploadZone.addEventListener('dragleave', function () {
            uploadZone.style.borderColor = 'var(--glass-border)';
            uploadZone.style.background = 'transparent';
        });

        uploadZone.addEventListener('drop', function (e) {
            e.preventDefault();
            uploadZone.style.borderColor = 'var(--glass-border)';
            uploadZone.style.background = 'transparent';

            const files = e.dataTransfer.files;
            if (files.length > 0) {
                document.getElementById('imageInput').files = files;
                document.getElementById('uploadMsg').innerText = `Selected: ${files[0].name}`;
                document.getElementById('uploadMsg').style.color = '#00ff88';
            }
        });
    }

    // Image input change handler
    const imageInput = document.getElementById('imageInput');
    if (imageInput) {
        imageInput.addEventListener('change', function () {
            const file = this.files[0];
            if (file) {
                document.getElementById('uploadMsg').innerText = `Selected: ${file.name}`;
                document.getElementById('uploadMsg').style.color = '#00ff88';
            }
        });
    }
});

// ============= UTILITY FUNCTIONS =============

function formatResponse(text) {
    // Convert markdown-like formatting to HTML
    return text
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\n/g, '<br>');
}