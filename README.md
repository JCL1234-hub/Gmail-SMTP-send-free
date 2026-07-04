# Code Craft Gmail SMTP OTP API V2

A complete, production-ready Node.js API for sending and verifying Single-Use Passwords (OTP) over Gmail SMTP, designed for deployment on Vercel Serverless Functions.

## Features
- **Secure 6-Digit OTP:** Randomized OTP generation.
- **Strict Expiry & Single-Use:** OTPs expire after 5 minutes and are automatically deleted upon verification.
- **Anti-Abuse Rate Limiting:** Restricts users to 3 OTP requests every 10 minutes per email.
- **Auto-Cleanup:** Expired OTP records are automatically purged from memory.
- **Modular Architecture:** Cleanly separated handlers, libraries, and storage systems.

## Deployment Setup

1. **Install Dependencies (Local Testing)**
   ```bash
   npm install
