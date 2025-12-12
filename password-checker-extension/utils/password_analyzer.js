/**
 * Password Analyzer Utility
 * Analyzes each character in a password and provides strength feedback
 */

const PasswordAnalyzer = {
    /**
     * Analyzes password strength character by character
     * @param {string} password - The password to analyze
     * @returns {Object} Analysis result with score, suggestions, and details
     */
    analyze(password) {
        if (!password) {
            return {
                score: 0,
                strength: 'none',
                suggestions: ['Enter a password to begin analysis'],
                details: {}
            };
        }

        const details = {
            length: password.length,
            hasLowercase: /[a-z]/.test(password),
            hasUppercase: /[A-Z]/.test(password),
            hasNumbers: /[0-9]/.test(password),
            hasSpecialChars: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
            hasSpaces: /\s/.test(password),
            commonPatterns: this.detectCommonPatterns(password),
            characterTypes: this.analyzeCharacterTypes(password),
            entropy: this.calculateEntropy(password)
        };

        const score = this.calculateScore(details);
        const strength = this.getStrengthLabel(score);
        const suggestions = this.generateSuggestions(details, password);

        return {
            score,
            strength,
            suggestions,
            details
        };
    },

    /**
     * Analyzes character types in the password
     */
    analyzeCharacterTypes(password) {
        const types = {
            lowercase: 0,
            uppercase: 0,
            numbers: 0,
            special: 0,
            spaces: 0,
            other: 0
        };

        for (const char of password) {
            if (/[a-z]/.test(char)) types.lowercase++;
            else if (/[A-Z]/.test(char)) types.uppercase++;
            else if (/[0-9]/.test(char)) types.numbers++;
            else if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(char)) types.special++;
            else if (/\s/.test(char)) types.spaces++;
            else types.other++;
        }

        return types;
    },

    /**
     * Detects common weak patterns
     */
    detectCommonPatterns(password) {
        const patterns = [];
        const lower = password.toLowerCase();

        // Sequential characters
        if (/abc|bcd|cde|def|efg|fgh|ghi|hij|ijk|jkl|klm|lmn|mno|nop|opq|pqr|qrs|rst|stu|tuv|uvw|vwx|wxy|xyz/i.test(password)) {
            patterns.push('sequential_letters');
        }
        if (/012|123|234|345|456|567|678|789/.test(password)) {
            patterns.push('sequential_numbers');
        }

        // Repeated characters
        if (/(.)\1{2,}/.test(password)) {
            patterns.push('repeated_characters');
        }

        // Common words
        const commonWords = ['password', 'admin', 'user', 'login', 'welcome', 'qwerty', 'letmein', 'monkey', 'dragon'];
        for (const word of commonWords) {
            if (lower.includes(word)) {
                patterns.push(`common_word_${word}`);
            }
        }

        // Keyboard patterns
        if (/qwerty|asdfgh|zxcvbn|qazwsx/i.test(password)) {
            patterns.push('keyboard_pattern');
        }

        return patterns;
    },

    /**
     * Calculates password entropy (randomness measure)
     */
    calculateEntropy(password) {
        const charSetSize = this.getCharacterSetSize(password);
        const entropy = password.length * Math.log2(charSetSize);
        return Math.round(entropy * 100) / 100;
    },

    getCharacterSetSize(password) {
        let size = 0;
        if (/[a-z]/.test(password)) size += 26;
        if (/[A-Z]/.test(password)) size += 26;
        if (/[0-9]/.test(password)) size += 10;
        if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) size += 32;
        if (/\s/.test(password)) size += 1;
        return size || 1;
    },

    /**
     * Calculates overall password score (0-100)
     */
    calculateScore(details) {
        let score = 0;

        // Length scoring (max 30 points)
        if (details.length >= 16) score += 30;
        else if (details.length >= 12) score += 25;
        else if (details.length >= 8) score += 15;
        else if (details.length >= 6) score += 5;

        // Character diversity (max 40 points)
        if (details.hasLowercase) score += 10;
        if (details.hasUppercase) score += 10;
        if (details.hasNumbers) score += 10;
        if (details.hasSpecialChars) score += 10;

        // Entropy bonus (max 20 points)
        if (details.entropy >= 80) score += 20;
        else if (details.entropy >= 60) score += 15;
        else if (details.entropy >= 40) score += 10;
        else if (details.entropy >= 20) score += 5;

        // Pattern penalties (max -30 points)
        score -= details.commonPatterns.length * 10;

        // Ensure score is between 0 and 100
        return Math.max(0, Math.min(100, score));
    },

    /**
     * Gets strength label based on score
     */
    getStrengthLabel(score) {
        if (score >= 80) return 'very_strong';
        if (score >= 60) return 'strong';
        if (score >= 40) return 'moderate';
        if (score >= 20) return 'weak';
        return 'very_weak';
    },

    /**
     * Generates improvement suggestions
     */
    generateSuggestions(details, password) {
        const suggestions = [];

        if (details.length < 12) {
            suggestions.push('⚠️ Use at least 12 characters (16+ recommended)');
        }

        if (!details.hasLowercase) {
            suggestions.push('➕ Add lowercase letters (a-z)');
        }

        if (!details.hasUppercase) {
            suggestions.push('➕ Add uppercase letters (A-Z)');
        }

        if (!details.hasNumbers) {
            suggestions.push('➕ Add numbers (0-9)');
        }

        if (!details.hasSpecialChars) {
            suggestions.push('➕ Add special characters (!@#$%^&*)');
        }

        if (details.commonPatterns.length > 0) {
            suggestions.push('🚫 Avoid common patterns and dictionary words');
        }

        if (details.hasSpaces) {
            suggestions.push('ℹ️ Spaces are allowed but may not work on all sites');
        }

        if (details.entropy < 40) {
            suggestions.push('🎲 Increase randomness - avoid predictable patterns');
        }

        if (suggestions.length === 0) {
            suggestions.push('✅ Excellent password! Keep it secure.');
        }

        return suggestions;
    }
};

// Make available globally for content script
if (typeof window !== 'undefined') {
    window.PasswordAnalyzer = PasswordAnalyzer;
}
