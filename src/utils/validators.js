export const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

export const isValidPassword = (password) => {
    // Min 8 chars, at least 1 uppercase, 1 lowercase, 1 number
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
    return passwordRegex.test(password);
};

export const isValidPhone = (phone) => {
    // Numeric, 10-15 digits
    const phoneRegex = /^\d{10,15}$/;
    // Allow dashes but strip them first for check if needed, but simple regex for now:
    // Or allow dashes/spaces: 
    const loosePhoneRegex = /^[0-9\-\+\s]{10,20}$/;
    return loosePhoneRegex.test(phone);
};

export const isNotEmpty = (value) => {
    if (value === null || value === undefined) return false;
    if (typeof value === 'string') return value.trim().length > 0;
    return true;
};

export const sanitizeInput = (input) => {
    if (typeof input !== 'string') return input;
    return input.replace(/[&<>"']/g, function (m) {
        return {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        }[m];
    });
};
