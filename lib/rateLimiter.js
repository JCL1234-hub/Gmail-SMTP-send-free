// Rate Limiter store leveraging global context for container persistence
if (!global.rateLimitStoreMap) {
    global.rateLimitStoreMap = new Map();
}

const rateLimitStore = global.rateLimitStoreMap;

/**
 * Enforces rate limiting: Maximum 3 requests per email in 10 minutes.
 * @param {string} email 
 * @returns {boolean} True if allowed, False if limit exceeded
 */
const checkRateLimit = (email) => {
    const now = Date.now();
    const tenMinutes = 10 * 60 * 1000;
    
    let requests = rateLimitStore.get(email) || [];
    
    // Purge timestamps older than 10 minutes
    requests = requests.filter(timestamp => now - timestamp < tenMinutes);
    
    // Check limit
    if (requests.length >= 3) {
        return false;
    }
    
    // Register new request
    requests.push(now);
    rateLimitStore.set(email, requests);
    
    return true; 
};

module.exports = { checkRateLimit };
