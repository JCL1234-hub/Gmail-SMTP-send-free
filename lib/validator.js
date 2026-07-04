/**
 * Validates the syntax of an email address using Regex.
 */
const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return email && emailRegex.test(email);
};

module.exports = { validateEmail };
