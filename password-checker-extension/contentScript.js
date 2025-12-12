/**
 * Content Script - Password Field Detector & Analyzer
 * Monitors password fields and provides real-time feedback
 */

(function () {
    'use strict';

    let currentPasswordField = null;
    let currentAnalysis = null;
    let feedbackPopup = null;
    let usernameField = null;

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    function init() {
        console.log('[Password Manager] Content script initialized');
        attachPasswordFieldListeners();
        observeNewPasswordFields();
    }

    /**
     * Attach listeners to all existing password fields
     */
    function attachPasswordFieldListeners() {
        const passwordFields = document.querySelectorAll('input[type="password"]');
        passwordFields.forEach(field => {
            if (!field.dataset.passwordManagerAttached) {
                attachListenersToField(field);
                field.dataset.passwordManagerAttached = 'true';
            }
        });
    }

    /**
     * Observe DOM for dynamically added password fields
     */
    function observeNewPasswordFields() {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === 1) { // Element node
                        if (node.matches && node.matches('input[type="password"]')) {
                            attachListenersToField(node);
                            node.dataset.passwordManagerAttached = 'true';
                        }
                        // Check children
                        const passwordFields = node.querySelectorAll && node.querySelectorAll('input[type="password"]');
                        if (passwordFields) {
                            passwordFields.forEach(field => {
                                if (!field.dataset.passwordManagerAttached) {
                                    attachListenersToField(field);
                                    field.dataset.passwordManagerAttached = 'true';
                                }
                            });
                        }
                    }
                });
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    /**
     * Attach event listeners to a password field
     */
    function attachListenersToField(field) {
        field.addEventListener('focus', handlePasswordFocus);
        field.addEventListener('input', handlePasswordInput);
        field.addEventListener('blur', handlePasswordBlur);

        // Add keyboard listener for Enter key as alternative to form submit
        field.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && field.value) {
                // Small delay to let form submit if it exists
                setTimeout(() => {
                    handleManualSave(field);
                }, 100);
            }
        });

        // Find associated form for submission detection
        const form = field.closest('form');
        if (form && !form.dataset.passwordManagerFormAttached) {
            form.addEventListener('submit', handleFormSubmit);
            form.dataset.passwordManagerFormAttached = 'true';
        }

        // Also listen for clicks on nearby buttons (for sites without forms)
        const container = field.closest('div, section, main, body');
        if (container) {
            const buttons = container.querySelectorAll('button, input[type="submit"], input[type="button"], a[role="button"]');
            buttons.forEach(button => {
                if (!button.dataset.passwordManagerButtonAttached) {
                    button.addEventListener('click', () => {
                        setTimeout(() => {
                            if (field.value) {
                                handleManualSave(field);
                            }
                        }, 100);
                    });
                    button.dataset.passwordManagerButtonAttached = 'true';
                }
            });
        }
    }

    /**
     * Handle password field focus
     */
    function handlePasswordFocus(event) {
        currentPasswordField = event.target;
        usernameField = findUsernameField(currentPasswordField);

        // Show initial feedback popup
        if (currentPasswordField.value) {
            analyzeAndShowFeedback(currentPasswordField.value);
        } else {
            showFeedbackPopup(currentPasswordField, {
                score: 0,
                strength: 'none',
                suggestions: ['Start typing to see password strength'],
                details: {}
            });
        }
    }

    /**
     * Handle password input changes
     */
    function handlePasswordInput(event) {
        const password = event.target.value;
        analyzeAndShowFeedback(password);
    }

    /**
     * Handle password field blur
     */
    function handlePasswordBlur(event) {
        // Delay hiding to allow clicking on popup
        setTimeout(() => {
            if (feedbackPopup && !feedbackPopup.matches(':hover')) {
                hideFeedbackPopup();
            }
        }, 200);
    }

    /**
     * Analyze password and show feedback
     */
    function analyzeAndShowFeedback(password) {
        if (!window.PasswordAnalyzer) {
            console.error('[Password Manager] PasswordAnalyzer not loaded');
            return;
        }

        currentAnalysis = window.PasswordAnalyzer.analyze(password);
        showFeedbackPopup(currentPasswordField, currentAnalysis);

        // Check for password reuse
        if (password.length >= 6) {
            checkPasswordReuse(password);
        }
    }

    /**
     * Check if password has been used before
     */
    function checkPasswordReuse(password) {
        chrome.runtime.sendMessage({
            action: 'checkPasswordReuse',
            password: password,
            currentUrl: window.location.hostname
        }, (response) => {
            if (response && response.isReused) {
                showReuseWarning(response.usedOn);
            }
        });
    }

    /**
     * Show password reuse warning
     */
    function showReuseWarning(usedOnSites) {
        if (!feedbackPopup) return;

        const warningDiv = document.createElement('div');
        warningDiv.className = 'password-manager-reuse-warning';
        warningDiv.innerHTML = `
      <strong>⚠️ PASSWORD REUSE DETECTED!</strong>
      <p>This password is already used on:</p>
      <ul>${usedOnSites.map(site => `<li>${site}</li>`).join('')}</ul>
      <p><em>Using the same password on multiple sites is a security risk!</em></p>
    `;

        // Insert at top of feedback popup
        const content = feedbackPopup.querySelector('.password-manager-content');
        content.insertBefore(warningDiv, content.firstChild);
    }

    /**
     * Show feedback popup near password field
     */
    function showFeedbackPopup(field, analysis) {
        // Remove existing popup
        hideFeedbackPopup();

        // Create popup
        feedbackPopup = document.createElement('div');
        feedbackPopup.className = 'password-manager-popup';
        feedbackPopup.innerHTML = `
      <div class="password-manager-content">
        <div class="password-manager-header">
          <span class="password-manager-strength password-manager-strength-${analysis.strength}">
            ${getStrengthEmoji(analysis.strength)} ${formatStrength(analysis.strength)}
          </span>
          <span class="password-manager-score">${analysis.score}/100</span>
        </div>
        <div class="password-manager-progress">
          <div class="password-manager-progress-bar password-manager-strength-${analysis.strength}" 
               style="width: ${analysis.score}%"></div>
        </div>
        ${analysis.details.entropy ? `
          <div class="password-manager-entropy">
            🎲 Entropy: ${analysis.details.entropy} bits
          </div>
        ` : ''}
        <div class="password-manager-suggestions">
          ${analysis.suggestions.map(s => `<div class="password-manager-suggestion">${s}</div>`).join('')}
        </div>
        ${analysis.details.characterTypes ? `
          <div class="password-manager-char-breakdown">
            <strong>Character Breakdown:</strong>
            <div class="password-manager-char-stats">
              ${analysis.details.characterTypes.lowercase > 0 ? `<span>Lowercase: ${analysis.details.characterTypes.lowercase}</span>` : ''}
              ${analysis.details.characterTypes.uppercase > 0 ? `<span>Uppercase: ${analysis.details.characterTypes.uppercase}</span>` : ''}
              ${analysis.details.characterTypes.numbers > 0 ? `<span>Numbers: ${analysis.details.characterTypes.numbers}</span>` : ''}
              ${analysis.details.characterTypes.special > 0 ? `<span>Special: ${analysis.details.characterTypes.special}</span>` : ''}
            </div>
          </div>
        ` : ''}
      </div>
    `;

        // Position popup
        document.body.appendChild(feedbackPopup);
        positionPopup(field, feedbackPopup);

        // Reposition on scroll/resize
        const repositionHandler = () => positionPopup(field, feedbackPopup);
        window.addEventListener('scroll', repositionHandler, true);
        window.addEventListener('resize', repositionHandler);
        feedbackPopup.dataset.repositionHandler = 'attached';
    }

    /**
     * Position popup relative to field
     */
    function positionPopup(field, popup) {
        const rect = field.getBoundingClientRect();
        const popupRect = popup.getBoundingClientRect();

        let top = rect.bottom + window.scrollY + 8;
        let left = rect.left + window.scrollX;

        // Adjust if popup goes off-screen
        if (left + popupRect.width > window.innerWidth) {
            left = window.innerWidth - popupRect.width - 10;
        }

        if (top + popupRect.height > window.innerHeight + window.scrollY) {
            top = rect.top + window.scrollY - popupRect.height - 8;
        }

        popup.style.top = `${top}px`;
        popup.style.left = `${left}px`;
    }

    /**
     * Hide feedback popup
     */
    function hideFeedbackPopup() {
        if (feedbackPopup) {
            feedbackPopup.remove();
            feedbackPopup = null;
        }
    }

    /**
     * Handle manual save (for sites without proper forms)
     */
    function handleManualSave(passwordField) {
        if (!passwordField || !passwordField.value) {
            return;
        }

        const username = findUsernameField(passwordField);
        const usernameValue = username ? username.value : '';

        const dataToSave = {
            url: window.location.href,
            hostname: window.location.hostname,
            username: usernameValue,
            password: passwordField.value,
            timestamp: new Date().toISOString(),
            analysis: currentAnalysis
        };

        console.log('[Password Manager] Manual save triggered for:', dataToSave.hostname);

        // Send to background script for storage
        chrome.runtime.sendMessage({
            action: 'savePassword',
            data: dataToSave
        }, (response) => {
            if (chrome.runtime.lastError) {
                console.error('[Password Manager] Runtime error:', chrome.runtime.lastError);
                return;
            }

            if (response && response.success) {
                console.log('[Password Manager] ✅ Password saved successfully!');
            } else {
                console.error('[Password Manager] ❌ Failed to save password:', response ? response.error : 'No response');
            }
        });
    }

    /**
     * Handle form submission
     */
    function handleFormSubmit(event) {
        const form = event.target;
        const passwordField = form.querySelector('input[type="password"]');

        if (!passwordField || !passwordField.value) {
            console.log('[Password Manager] No password field or empty password');
            return;
        }

        const username = findUsernameField(passwordField);
        const usernameValue = username ? username.value : '';

        const dataToSave = {
            url: window.location.href,
            hostname: window.location.hostname,
            username: usernameValue,
            password: passwordField.value,
            timestamp: new Date().toISOString(),
            analysis: currentAnalysis
        };

        console.log('[Password Manager] Attempting to save password for:', dataToSave.hostname);
        console.log('[Password Manager] Username:', usernameValue || '(no username found)');

        // Send to background script for storage
        chrome.runtime.sendMessage({
            action: 'savePassword',
            data: dataToSave
        }, (response) => {
            if (chrome.runtime.lastError) {
                console.error('[Password Manager] Runtime error:', chrome.runtime.lastError);
                return;
            }

            if (response && response.success) {
                if (response.skipped) {
                    console.log('[Password Manager] ⏭️ Password already saved (no changes)');
                    // Don't show alert for duplicates
                } else if (response.updated) {
                    console.log('[Password Manager] 🔄 Password updated!');
                    alert('🔄 Password updated in vault!');
                } else {
                    console.log('[Password Manager] ✅ New password saved!');
                    alert('✅ Password saved to vault!');
                }
            } else {
                console.error('[Password Manager] ❌ Failed to save password:', response ? response.error : 'No response');
                alert('❌ Failed to save password. Check console for details.');
            }
        });
    }

    /**
     * Find username field associated with password field
     */
    function findUsernameField(passwordField) {
        const form = passwordField.closest('form');
        if (!form) return null;

        // Look for email or text input before password field
        const inputs = Array.from(form.querySelectorAll('input[type="email"], input[type="text"]'));

        // Find the closest input before the password field
        const passwordIndex = Array.from(form.querySelectorAll('input')).indexOf(passwordField);
        const candidateInputs = inputs.filter(input => {
            const inputIndex = Array.from(form.querySelectorAll('input')).indexOf(input);
            return inputIndex < passwordIndex;
        });

        return candidateInputs.length > 0 ? candidateInputs[candidateInputs.length - 1] : null;
    }

    /**
     * Helper functions
     */
    function getStrengthEmoji(strength) {
        const emojis = {
            'very_strong': '🛡️',
            'strong': '💪',
            'moderate': '⚡',
            'weak': '⚠️',
            'very_weak': '🚨',
            'none': '🔒'
        };
        return emojis[strength] || '🔒';
    }

    function formatStrength(strength) {
        return strength.replace(/_/g, ' ').toUpperCase();
    }

})();
