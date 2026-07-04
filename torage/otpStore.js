/**
 * In-memory storage utilizing the global object to persist state 
 * across module hot-reloads within the same Vercel serverless container.
 */
if (!global.otpStoreMap) {
    global.otpStoreMap = new Map();
}

const store = global.otpStoreMap;

const otpStore = {
    // Store email, OTP, createdAt, expiresAt, and attempts
    set: (email, data) => {
        store.set(email, data);
    },
    get: (email) => {
        return store.get(email);
    },
    delete: (email) => {
        store.delete(email);
    },
    // Automatically remove expired OTP entries
    cleanup: () => {
        const now = Date.now();
        for (const [email, data] of store.entries()) {
            if (now > data.expiresAt) {
                store.delete(email);
            }
        }
    }
};

module.exports = otpStore;
