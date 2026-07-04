/**
 * Generates a secure, random 6-digit One-Time Password.
 */
const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

module.exports = { generateOTP };
