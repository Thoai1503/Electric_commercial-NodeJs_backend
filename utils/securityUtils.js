const crypto = require('crypto');
const validator = require('validator');

class SecurityUtils {
  // Input sanitization
  static sanitizeInput(input) {
    if (typeof input !== 'string') return input;
    
    return input
      .trim()
      .replace(/[<>]/g, '') // Remove potential HTML tags
      .replace(/javascript:/gi, '') // Remove javascript: protocol
      .replace(/on\w+=/gi, ''); // Remove event handlers
  }

  // Email validation
  static isValidEmail(email) {
    return validator.isEmail(email) && email.length <= 254;
  }

  // Phone number validation
  static isValidPhone(phone) {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    return phoneRegex.test(phone);
  }

  // Password strength validation
  static validatePasswordStrength(password) {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChars = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);

    const errors = [];
    
    if (password.length < minLength) {
      errors.push(`Password must be at least ${minLength} characters long`);
    }
    if (!hasUpperCase) {
      errors.push('Password must contain at least one uppercase letter');
    }
    if (!hasLowerCase) {
      errors.push('Password must contain at least one lowercase letter');
    }
    if (!hasNumbers) {
      errors.push('Password must contain at least one number');
    }
    if (!hasSpecialChars) {
      errors.push('Password must contain at least one special character');
    }

    return {
      isValid: errors.length === 0,
      errors,
      score: this.calculatePasswordScore(password)
    };
  }

  // Calculate password strength score (0-100)
  static calculatePasswordScore(password) {
    let score = 0;

    // Length contribution
    if (password.length >= 8) score += 25;
    if (password.length >= 12) score += 10;
    if (password.length >= 16) score += 10;

    // Character variety contribution
    if (/[a-z]/.test(password)) score += 10;
    if (/[A-Z]/.test(password)) score += 10;
    if (/\d/.test(password)) score += 10;
    if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) score += 15;

    // Deduct for common patterns
    if (/(.)\1{2,}/.test(password)) score -= 10;
    if (/123|abc|qwe/i.test(password)) score -= 10;

    return Math.max(0, Math.min(100, score));
  }

  // Generate secure random string
  static generateSecureString(length = 32) {
    return crypto.randomBytes(length).toString('hex');
  }

  // Generate secure random number
  static generateSecureNumber(min, max) {
    const range = max - min + 1;
    const bytes = crypto.randomBytes(4);
    const value = bytes.readUInt32BE(0);
    return min + (value % range);
  }

  // Hash sensitive data
  static hashData(data, salt = null) {
    if (!salt) {
      salt = crypto.randomBytes(16).toString('hex');
    }
    
    const hash = crypto.pbkdf2Sync(data, salt, 1000, 64, 'sha512').toString('hex');
    return { hash, salt };
  }

  // Verify hashed data
  static verifyHash(data, hash, salt) {
    const { hash: computedHash } = this.hashData(data, salt);
    return crypto.timingSafeEqual(Buffer.from(hash, 'hex'), Buffer.from(computedHash, 'hex'));
  }

  // Rate limiting helper
  static createRateLimitKey(identifier, action) {
    return `rate_limit:${action}:${identifier}`;
  }

  // IP address validation
  static isValidIP(ip) {
    return validator.isIP(ip, 4) || validator.isIP(ip, 6);
  }

  // URL validation
  static isValidURL(url) {
    return validator.isURL(url, {
      protocols: ['http', 'https'],
      require_protocol: true,
      require_valid_protocol: true
    });
  }

  // XSS prevention
  static escapeHtml(text) {
    const map = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
  }

  // SQL injection prevention (basic)
  static sanitizeSQL(input) {
    if (typeof input !== 'string') return input;
    
    return input
      .replace(/['";\\]/g, '') // Remove dangerous characters
      .replace(/--/g, '') // Remove SQL comments
      .replace(/\/\*/g, '') // Remove SQL block comments
      .replace(/\*\//g, '');
  }

  // CSRF token generation
  static generateCSRFToken() {
    return crypto.randomBytes(32).toString('hex');
  }

  // Validate CSRF token
  static validateCSRFToken(token, storedToken) {
    if (!token || !storedToken) return false;
    return crypto.timingSafeEqual(Buffer.from(token, 'hex'), Buffer.from(storedToken, 'hex'));
  }

  // Input length validation
  static validateInputLength(input, minLength, maxLength) {
    if (!input) return false;
    const length = input.toString().length;
    return length >= minLength && length <= maxLength;
  }

  // File type validation
  static isValidFileType(filename, allowedTypes) {
    const extension = filename.split('.').pop()?.toLowerCase();
    return allowedTypes.includes(extension);
  }

  // File size validation
  static isValidFileSize(size, maxSize) {
    return size <= maxSize;
  }

  // Generate secure filename
  static generateSecureFilename(originalName) {
    const extension = originalName.split('.').pop();
    const timestamp = Date.now();
    const randomString = this.generateSecureString(8);
    return `${timestamp}_${randomString}.${extension}`;
  }

  // Validate user input object
  static validateUserInput(input, schema) {
    const errors = {};
    
    for (const [field, rules] of Object.entries(schema)) {
      const value = input[field];
      
      if (rules.required && !value) {
        errors[field] = `${field} is required`;
        continue;
      }
      
      if (value) {
        // Type validation
        if (rules.type && typeof value !== rules.type) {
          errors[field] = `${field} must be a ${rules.type}`;
        }
        
        // Length validation
        if (rules.minLength && value.length < rules.minLength) {
          errors[field] = `${field} must be at least ${rules.minLength} characters`;
        }
        
        if (rules.maxLength && value.length > rules.maxLength) {
          errors[field] = `${field} must be no more than ${rules.maxLength} characters`;
        }
        
        // Pattern validation
        if (rules.pattern && !rules.pattern.test(value)) {
          errors[field] = `${field} format is invalid`;
        }
        
        // Custom validation
        if (rules.custom && !rules.custom(value)) {
          errors[field] = rules.customMessage || `${field} is invalid`;
        }
      }
    }
    
    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  }
}

module.exports = SecurityUtils;
