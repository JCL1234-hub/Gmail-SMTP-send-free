const { validateEmail } = require('../lib/validator');
const otpStore = require('../storage/otpStore');

module.exports = async function handler(req, res) {
    res.setHeader('Content-Type', 'application/json');

    if (req.method !== 'POST') {
        return res.status(405).json({ success: false, message: 'Method Not Allowed' });
    }

    try {
        const { email, otp } = req.body;

        // 1. Inputs validation
        if (!validateEmail(email)) {
            return res.status(400).json({ success: false, message: 'Invalid email address' });
        }

        if (!otp) {
            return res.status(400).json({ success: false, message: 'OTP is required' });
        }

        // 2. Automatically remove expired entries before querying
        otpStore.cleanup();

        // 3. Retrieve record
        const record = otpStore.get(email);

        // 4. Reject if no OTP exists (not found / already used)
        if (!record) {
            return res.status(400).json({
                success: false,
                message: 'OTP not found'
            });
        }

        // 5. Reject Expired OTP
        if (Date.now() > record.expiresAt) {
            otpStore.delete(email); // immediate clean up
            return res.status(400).json({
                success: false,
                verified: false,
                message: 'OTP expired'
            });
        }

        // 6. Reject Invalid OTP & log attempt
        if (record.otp !== String(otp)) {
            record.attempts += 1;
            otpStore.set(email, record);
            
            return res.status(400).json({
                success: false,
                verified: false,
                message: 'Invalid OTP'
            });
        }

        // 7. Successful Verification: Delete to prevent reuse
        otpStore.delete(email);

        return res.status(200).json({
            success: true,
            verified: true,
            message: 'OTP verified successfully'
        });

    } catch (error) {
        console.error('Error verifying OTP:', error);
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};
