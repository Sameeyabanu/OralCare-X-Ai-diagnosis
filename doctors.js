// ===============================================
// ORAL CARE AI - Doctor Database & Appointment System
// ===============================================

// Doctor Database with profiles
const doctorsDatabase = [
    {
        id: 1,
        name: "Dr. Rajesh Kumar",
        nameHi: "डॉ. राजेश कुमार",
        specialty: "General Dentistry",
        specialtyHi: "सामान्य दंत चिकित्सा",
        experience: 15,
        qualifications: "BDS, MDS (Conservative Dentistry)",
        qualificationsHi: "बीडीएस, एमडीएस (कंजर्वेटिव डेंटिस्ट्री)",
        rating: 4.9,
        reviews: 342,
        image: "👨‍⚕️",
        bio: "Specialist in preventive care and restorative treatments with 15 years of experience.",
        bioHi: "15 वर्षों के अनुभव के साथ निवारक देखभाल और पुनर्स्थापनात्मक उपचार में विशेषज्ञ।",
        availableDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        timeSlots: ["09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "14:00", "14:30", "15:00", "15:30", "16:00"],
        consultationFee: 500
    },
    {
        id: 2,
        name: "Dr. Priya Sharma",
        nameHi: "डॉ. प्रिया शर्मा",
        specialty: "Orthodontics",
        specialtyHi: "ऑर्थोडॉन्टिक्स",
        experience: 12,
        qualifications: "BDS, MDS (Orthodontics)",
        qualificationsHi: "बीडीएस, एमडीएस (ऑर्थोडॉन्टिक्स)",
        rating: 4.8,
        reviews: 289,
        image: "👩‍⚕️",
        bio: "Expert in braces, aligners, and smile correction treatments.",
        bioHi: "ब्रेसेस, एलाइनर्स और स्माइल करेक्शन ट्रीटमेंट में विशेषज्ञ।",
        availableDays: ["Monday", "Wednesday", "Friday", "Saturday"],
        timeSlots: ["10:00", "10:30", "11:00", "11:30", "12:00", "15:00", "15:30", "16:00", "16:30"],
        consultationFee: 700
    },
    {
        id: 3,
        name: "Dr. Amit Patel",
        nameHi: "डॉ. अमित पटेल",
        specialty: "Oral Surgery",
        specialtyHi: "मौखिक सर्जरी",
        experience: 18,
        qualifications: "BDS, MDS (Oral & Maxillofacial Surgery)",
        qualificationsHi: "बीडीएस, एमडीएस (ओरल एंड मैक्सिलोफेशियल सर्जरी)",
        rating: 4.9,
        reviews: 456,
        image: "👨‍⚕️",
        bio: "Renowned oral surgeon specializing in wisdom tooth extraction and dental implants.",
        bioHi: "विजडम टूथ निकालने और डेंटल इम्प्लांट में विशेषज्ञ प्रसिद्ध ओरल सर्जन।",
        availableDays: ["Tuesday", "Thursday", "Saturday"],
        timeSlots: ["09:00", "09:30", "10:00", "10:30", "11:00", "14:00", "14:30", "15:00"],
        consultationFee: 1000
    },
    {
        id: 4,
        name: "Dr. Sneha Reddy",
        nameHi: "डॉ. स्नेहा रेड्डी",
        specialty: "Pediatric Dentistry",
        specialtyHi: "बाल दंत चिकित्सा",
        experience: 10,
        qualifications: "BDS, MDS (Pedodontics)",
        qualificationsHi: "बीडीएस, एमडीएस (पीडोडॉन्टिक्स)",
        rating: 4.9,
        reviews: 398,
        image: "👩‍⚕️",
        bio: "Child-friendly dentist with expertise in treating children and special needs patients.",
        bioHi: "बच्चों और विशेष जरूरतों वाले रोगियों के इलाज में विशेषज्ञता के साथ बाल-मैत्रीपूर्ण दंत चिकित्सक।",
        availableDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        timeSlots: ["09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "15:00", "15:30", "16:00", "16:30", "17:00"],
        consultationFee: 600
    },
    {
        id: 5,
        name: "Dr. Vikram Singh",
        nameHi: "डॉ. विक्रम सिंह",
        specialty: "Prosthodontics",
        specialtyHi: "प्रोस्थोडॉन्टिक्स",
        experience: 14,
        qualifications: "BDS, MDS (Prosthodontics)",
        qualificationsHi: "बीडीएस, एमडीएस (प्रोस्थोडॉन्टिक्स)",
        rating: 4.7,
        reviews: 267,
        image: "👨‍⚕️",
        bio: "Expert in dental crowns, bridges, dentures, and smile makeovers.",
        bioHi: "डेंटल क्राउन, ब्रिज, डेन्चर और स्माइल मेकओवर में विशेषज्ञ।",
        availableDays: ["Monday", "Wednesday", "Thursday", "Friday"],
        timeSlots: ["10:00", "10:30", "11:00", "11:30", "14:00", "14:30", "15:00", "15:30", "16:00"],
        consultationFee: 800
    },
    {
        id: 6,
        name: "Dr. Ananya Gupta",
        nameHi: "डॉ. अनन्या गुप्ता",
        specialty: "Endodontics",
        specialtyHi: "एंडोडॉन्टिक्स",
        experience: 8,
        qualifications: "BDS, MDS (Endodontics)",
        qualificationsHi: "बीडीएस, एमडीएस (एंडोडॉन्टिक्स)",
        rating: 4.8,
        reviews: 189,
        image: "👩‍⚕️",
        bio: "Specialist in root canal treatments and dental pain management.",
        bioHi: "रूट कैनाल उपचार और दंत दर्द प्रबंधन में विशेषज्ञ।",
        availableDays: ["Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        timeSlots: ["09:00", "09:30", "10:00", "10:30", "11:00", "14:00", "14:30", "15:00", "15:30"],
        consultationFee: 750
    }
];

// Appointment Types
const appointmentTypes = [
    { id: "checkup", name: "Regular Checkup", nameHi: "नियमित जांच", duration: 30 },
    { id: "cleaning", name: "Teeth Cleaning", nameHi: "दांतों की सफाई", duration: 45 },
    { id: "treatment", name: "Treatment", nameHi: "उपचार", duration: 60 },
    { id: "consultation", name: "Consultation", nameHi: "परामर्श", duration: 30 },
    { id: "emergency", name: "Emergency", nameHi: "आपातकालीन", duration: 45 }
];

// ===============================================
// DOCTOR FUNCTIONS
// ===============================================

// Get all doctors
function getAllDoctors() {
    return doctorsDatabase;
}

// Get doctor by ID
function getDoctorById(id) {
    return doctorsDatabase.find(doctor => doctor.id === parseInt(id));
}

// Get doctors by specialty
function getDoctorsBySpecialty(specialty) {
    if (!specialty || specialty === 'all') {
        return doctorsDatabase;
    }
    return doctorsDatabase.filter(doctor => 
        doctor.specialty.toLowerCase() === specialty.toLowerCase()
    );
}

// Get unique specialties
function getSpecialties() {
    const specialties = [...new Set(doctorsDatabase.map(doctor => doctor.specialty))];
    return specialties;
}

// ===============================================
// AVAILABILITY FUNCTIONS
// ===============================================

// Check if doctor is available on a given day
function isDoctorAvailable(doctorId, dayName) {
    const doctor = getDoctorById(doctorId);
    if (!doctor) return false;
    return doctor.availableDays.includes(dayName);
}

// Get available time slots for a doctor on a specific date
function getAvailableSlots(doctorId, date) {
    const doctor = getDoctorById(doctorId);
    if (!doctor) return [];
    
    const dayName = new Date(date).toLocaleDateString('en-US', { weekday: 'long' });
    
    if (!doctor.availableDays.includes(dayName)) {
        return [];
    }
    
    // Get existing appointments for this doctor on this date
    const appointments = getAppointments();
    const bookedSlots = appointments
        .filter(apt => apt.doctorId === doctorId && apt.date === date)
        .map(apt => apt.time);
    
    // Return available slots (excluding booked ones)
    return doctor.timeSlots.filter(slot => !bookedSlots.includes(slot));
}

// Get next 14 available dates for a doctor
function getAvailableDates(doctorId) {
    const doctor = getDoctorById(doctorId);
    if (!doctor) return [];
    
    const dates = [];
    const today = new Date();
    
    for (let i = 1; i <= 30 && dates.length < 14; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() + i);
        const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
        
        if (doctor.availableDays.includes(dayName)) {
            dates.push({
                date: date.toISOString().split('T')[0],
                dayName: dayName,
                display: date.toLocaleDateString('en-US', { 
                    weekday: 'short', 
                    month: 'short', 
                    day: 'numeric' 
                })
            });
        }
    }
    
    return dates;
}

// ===============================================
// APPOINTMENT MANAGEMENT
// ===============================================

// Get all appointments from localStorage
function getAppointments() {
    const appointments = localStorage.getItem('oralcare_appointments');
    return appointments ? JSON.parse(appointments) : [];
}

// Book a new appointment
function bookAppointment(appointmentData) {
    const appointments = getAppointments();
    
    // Generate unique appointment ID
    const appointmentId = 'APT' + Date.now() + Math.random().toString(36).substr(2, 4).toUpperCase();
    
    const newAppointment = {
        id: appointmentId,
        ...appointmentData,
        status: 'confirmed',
        createdAt: new Date().toISOString()
    };
    
    appointments.push(newAppointment);
    localStorage.setItem('oralcare_appointments', JSON.stringify(appointments));
    
    return newAppointment;
}

// Cancel an appointment
function cancelAppointment(appointmentId) {
    const appointments = getAppointments();
    const index = appointments.findIndex(apt => apt.id === appointmentId);
    
    if (index !== -1) {
        appointments[index].status = 'cancelled';
        localStorage.setItem('oralcare_appointments', JSON.stringify(appointments));
        return true;
    }
    return false;
}

// Get appointments for a specific patient (by phone or email)
function getPatientAppointments(identifier) {
    const appointments = getAppointments();
    return appointments.filter(apt => 
        apt.phone === identifier || apt.email === identifier
    );
}

// Get upcoming appointments for a doctor
function getDoctorAppointments(doctorId) {
    const appointments = getAppointments();
    const today = new Date().toISOString().split('T')[0];
    
    return appointments.filter(apt => 
        apt.doctorId === doctorId && 
        apt.date >= today &&
        apt.status === 'confirmed'
    );
}

// ===============================================
// UTILITY FUNCTIONS
// ===============================================

// Format time to 12-hour format
function formatTime(time24) {
    const [hours, minutes] = time24.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
}

// Format date for display
function formatDate(dateStr) {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// Validate appointment data
function validateAppointmentData(data) {
    const errors = [];
    
    if (!data.patientName || data.patientName.trim().length < 2) {
        errors.push('Please enter a valid name');
    }
    
    if (!data.phone || !/^[0-9]{10}$/.test(data.phone)) {
        errors.push('Please enter a valid 10-digit phone number');
    }
    
    if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
        errors.push('Please enter a valid email address');
    }
    
    if (!data.doctorId) {
        errors.push('Please select a doctor');
    }
    
    if (!data.date) {
        errors.push('Please select a date');
    }
    
    if (!data.time) {
        errors.push('Please select a time slot');
    }
    
    if (!data.appointmentType) {
        errors.push('Please select appointment type');
    }
    
    return errors;
}

// Export functions for global use
window.DoctorDB = {
    getAllDoctors,
    getDoctorById,
    getDoctorsBySpecialty,
    getSpecialties,
    isDoctorAvailable,
    getAvailableSlots,
    getAvailableDates,
    getAppointments,
    bookAppointment,
    cancelAppointment,
    getPatientAppointments,
    getDoctorAppointments,
    formatTime,
    formatDate,
    validateAppointmentData,
    appointmentTypes
};
