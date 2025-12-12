/**
 * Popup Script
 * Handles popup UI interactions
 */

document.addEventListener('DOMContentLoaded', async () => {
    await loadStats();
    setupEventListeners();
});

/**
 * Load password statistics
 */
async function loadStats() {
    try {
        const result = await chrome.storage.local.get('stored_passwords_metadata');
        const metadata = result.stored_passwords_metadata || [];

        document.getElementById('password-count').textContent = metadata.length;

        if (metadata.length > 0) {
            document.getElementById('status-text').textContent = 'Active & Monitoring';
        } else {
            document.getElementById('status-text').textContent = 'No passwords saved yet';
        }
    } catch (error) {
        console.error('Error loading stats:', error);
        document.getElementById('status-text').textContent = 'Error loading data';
    }
}

/**
 * Setup event listeners
 */
function setupEventListeners() {
    document.getElementById('open-vault-btn').addEventListener('click', () => {
        // Send message to background to open vault folder
        chrome.runtime.sendMessage({ action: 'openVault' });
    });

    document.getElementById('setup-btn').addEventListener('click', () => {
        chrome.tabs.create({ url: chrome.runtime.getURL('setup.html') });
    });
}
