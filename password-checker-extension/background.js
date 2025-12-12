/**
 * Background Service Worker
 * Handles communication between content script and native messaging host
 */

const NATIVE_HOST_NAME = 'com.password_manager.host';
const PASSWORD_STORAGE_KEY = 'stored_passwords_metadata';

/**
 * Listen for messages from content scripts
 */
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'savePassword') {
        handleSavePassword(request.data, sendResponse);
        return true; // Keep channel open for async response
    } else if (request.action === 'checkPasswordReuse') {
        handleCheckPasswordReuse(request.password, request.currentUrl, sendResponse);
        return true;
    }
});

/**
 * Save password via native messaging host
 */
async function handleSavePassword(data, sendResponse) {
    console.log('[Background] Received savePassword request for:', data.hostname);

    try {
        console.log('[Background] Attempting to connect to native host:', NATIVE_HOST_NAME);

        // First, save to native host (local file system)
        const nativeResponse = await sendToNativeHost({
            action: 'save',
            data: data
        });

        console.log('[Background] Native host response:', nativeResponse);

        if (nativeResponse && nativeResponse.success) {
            if (nativeResponse.skipped) {
                console.log('[Background] ⏭️ Password already saved (no changes)');
                sendResponse({ success: true, message: 'Password already saved', skipped: true });
            } else if (nativeResponse.updated) {
                console.log('[Background] 🔄 Password updated successfully');
                // Also store metadata in chrome.storage for reuse detection
                await storePasswordMetadata(data);
                sendResponse({ success: true, message: 'Password updated successfully', updated: true });
            } else {
                console.log('[Background] ✅ New password saved successfully');
                // Also store metadata in chrome.storage for reuse detection
                await storePasswordMetadata(data);
                sendResponse({ success: true, message: 'Password saved successfully' });
            }
        } else {
            console.error('[Background] ❌ Native host failed:', nativeResponse);
            sendResponse({ success: false, error: nativeResponse ? nativeResponse.error : 'No response from native host' });
        }
    } catch (error) {
        console.error('[Background] ❌ Exception in handleSavePassword:', error);
        console.error('[Background] Error details:', error.message, error.stack);
        sendResponse({ success: false, error: error.message });
    }
}

/**
 * Check if password has been used before
 */
async function handleCheckPasswordReuse(password, currentUrl, sendResponse) {
    try {
        const metadata = await getPasswordMetadata();
        const usedOn = [];

        // Simple hash for comparison (in production, use proper crypto)
        const passwordHash = await simpleHash(password);

        for (const entry of metadata) {
            if (entry.passwordHash === passwordHash && entry.hostname !== currentUrl) {
                usedOn.push(entry.hostname);
            }
        }

        sendResponse({
            isReused: usedOn.length > 0,
            usedOn: usedOn
        });
    } catch (error) {
        console.error('[Background] Error checking password reuse:', error);
        sendResponse({ isReused: false, usedOn: [] });
    }
}

/**
 * Send message to native messaging host
 */
function sendToNativeHost(message) {
    return new Promise((resolve, reject) => {
        try {
            console.log('[Background] Connecting to native host:', NATIVE_HOST_NAME);
            const port = chrome.runtime.connectNative(NATIVE_HOST_NAME);

            console.log('[Background] Port created, sending message:', message);

            port.onMessage.addListener((response) => {
                console.log('[Background] Received response from native host:', response);
                resolve(response);
                port.disconnect();
            });

            port.onDisconnect.addListener(() => {
                const error = chrome.runtime.lastError;
                if (error) {
                    console.error('[Background] ❌ Native host disconnected with error:', error);
                    console.error('[Background] Error message:', error.message);
                    reject(new Error(error.message || 'Native host disconnected'));
                } else {
                    console.warn('[Background] Native host disconnected without error');
                    resolve({ success: false, error: 'Native host disconnected' });
                }
            });

            port.postMessage(message);
            console.log('[Background] Message posted to native host');
        } catch (error) {
            console.error('[Background] ❌ Exception in sendToNativeHost:', error);
            reject(error);
        }
    });
}

/**
 * Store password metadata for reuse detection
 */
async function storePasswordMetadata(data) {
    const metadata = await getPasswordMetadata();

    const passwordHash = await simpleHash(data.password);

    metadata.push({
        hostname: data.hostname,
        username: data.username,
        passwordHash: passwordHash,
        timestamp: data.timestamp
    });

    await chrome.storage.local.set({ [PASSWORD_STORAGE_KEY]: metadata });
}

/**
 * Get stored password metadata
 */
async function getPasswordMetadata() {
    const result = await chrome.storage.local.get(PASSWORD_STORAGE_KEY);
    return result[PASSWORD_STORAGE_KEY] || [];
}

/**
 * Simple hash function for password comparison
 * NOTE: In production, use Web Crypto API with proper salt
 */
async function simpleHash(str) {
    const encoder = new TextEncoder();
    const data = encoder.encode(str);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Handle extension installation
 */
chrome.runtime.onInstalled.addListener((details) => {
    if (details.reason === 'install') {
        console.log('[Background] Extension installed');
        // Open setup instructions
        chrome.tabs.create({
            url: chrome.runtime.getURL('setup.html')
        });
    }
});
