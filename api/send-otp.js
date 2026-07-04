const { validateEmail } = require('../lib/validator');
const { generateOTP } = require('../lib/otp');
const { checkRateLimit } = require('../lib/rateLimiter');
const { sendOTPEmail } = require('../lib/mailer');
const otpStore = require('../storage/otpStore');

module.exports = async function handler(req, res) {
    res.setHeader('Content-Type', 'application/json');

    if (req.method !== 'POST') {
        return res.status(405).json({ success: false, message: 'Method Not Allowed' });
    }

    try {
        const { email } = req.body;

        // 1. Validate Email
        if (!validateEmail(email)) {
            return res.status(400).json({ success: false, message: 'Invalid email address' });
        }

        // 2. Rate Limiting Check
        if (!checkRateLimit(email)) {
            return res.status(429).json({ success: false, message: 'Too many requests. Maximum 3 per 10 minutes.' });
        }

        // 3. Automatically clean up expired records in storage
        otpStore.cleanup();

        // 4. Generate OTP & configure metadata
        const otp = generateOTP();
        const createdAt = Date.now();
        // OTP logic expires after 5 minutes as required by system parameters
        const expiresAt = createdAt + 5 * 60 * 1000; 
        
        // 5. Store OTP record structurally
        otpStore.set(email, {
            otp,
            createdAt,
            expiresAt,
            attempts: 0
        });

        // 6. Send Mail
        await sendOTPEmail(email, otp);

        // 7. Standardized Success Response
        return res.status(200).json({
            success: true,
            message: 'OTP sent successfully',
            expiresIn: '20 minutes'
        });

    } catch (error) {
        console.error('Error sending OTP:', error);
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};
