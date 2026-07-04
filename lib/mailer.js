const nodemailer = require('nodemailer');

/**
 * Dispatches the OTP email using Gmail SMTP securely.
 * Credentials are read dynamically from environment variables.
 */
const sendOTPEmail = async (email, otp) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.GMAIL_USER,
            pass: process.env.GMAIL_APP_PASSWORD
        }
    });

    const mailOptions = {
        from: process.env.GMAIL_USER,
        to: email,
        subject: 'Verification Code',
        text: `Hello,\n\nYour verification code is:\n\n${otp}\n\nThis code expires in 20 minutes.\n\nIf you did not request this code, please ignore this email.`
    };

    return transporter.sendMail(mailOptions);
};

module.exports = { sendOTPEmail };
