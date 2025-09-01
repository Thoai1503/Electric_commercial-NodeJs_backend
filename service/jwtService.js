const jwt = require('jsonwebtoken');
const crypto = require('crypto');

class JWTService {
  constructor() {
    this.accessTokenSecret = process.env.JWT_SECRET;
    this.refreshTokenSecret = process.env.JWT_REFRESH_SECRET;
    this.accessTokenExpiry = process.env.JWT_EXPIRE || '15m';
    this.refreshTokenExpiry = process.env.JWT_REFRESH_EXPIRE || '7d';
  }

  // Generate access token
  generateAccessToken(payload) {
    return jwt.sign(payload, this.accessTokenSecret, {
      expiresIn: this.accessTokenExpiry,
      issuer: 'electric-store-api',
      audience: 'electric-store-client'
    });
  }

  // Generate refresh token
  generateRefreshToken(payload) {
    return jwt.sign(payload, this.refreshTokenSecret, {
      expiresIn: this.refreshTokenExpiry,
      issuer: 'electric-store-api',
      audience: 'electric-store-client'
    });
  }

  // Generate both tokens
  generateTokens(payload) {
    console.log("JWT Service - Generating tokens for payload:", payload);
    console.log("JWT Service - Access token secret:", this.accessTokenSecret ? "EXISTS" : "MISSING");
    console.log("JWT Service - Refresh token secret:", this.refreshTokenSecret ? "EXISTS" : "MISSING");
    
    const accessToken = this.generateAccessToken(payload);
    const refreshToken = this.generateRefreshToken(payload);
    
    console.log("JWT Service - Generated tokens:", {
      accessToken: accessToken ? "EXISTS" : "MISSING",
      refreshToken: refreshToken ? "EXISTS" : "MISSING"
    });
    
    return {
      accessToken,
      refreshToken,
      expiresIn: this.getTokenExpiryTime(this.accessTokenExpiry)
    };
  }

  // Verify access token
  verifyAccessToken(token) {
    try {
      return jwt.verify(token, this.accessTokenSecret, {
        issuer: 'electric-store-api',
        audience: 'electric-store-client'
      });
    } catch (error) {
      throw new Error('Invalid access token');
    }
  }

  // Verify refresh token
  verifyRefreshToken(token) {
    try {
      return jwt.verify(token, this.refreshTokenSecret, {
        issuer: 'electric-store-api',
        audience: 'electric-store-client'
      });
    } catch (error) {
      throw new Error('Invalid refresh token');
    }
  }

  // Decode token without verification (for logging purposes)
  decodeToken(token) {
    try {
      return jwt.decode(token);
    } catch (error) {
      return null;
    }
  }

  // Get token expiry time in seconds
  getTokenExpiryTime(expiryString) {
    const match = expiryString.match(/^(\d+)([smhd])$/);
    if (!match) return 900; // Default 15 minutes

    const value = parseInt(match[1]);
    const unit = match[2];

    switch (unit) {
      case 's': return value;
      case 'm': return value * 60;
      case 'h': return value * 3600;
      case 'd': return value * 86400;
      default: return 900;
    }
  }

  // Generate random token for password reset
  generatePasswordResetToken() {
    return crypto.randomBytes(32).toString('hex');
  }

  // Generate email verification token
  generateEmailVerificationToken(payload) {
    return jwt.sign(payload, this.accessTokenSecret, {
      expiresIn: '24h',
      issuer: 'electric-store-api',
      audience: 'electric-store-client'
    });
  }

  // Check if token is expired
  isTokenExpired(token) {
    try {
      const decoded = jwt.decode(token);
      if (!decoded || !decoded.exp) return true;
      
      const currentTime = Math.floor(Date.now() / 1000);
      return decoded.exp < currentTime;
    } catch (error) {
      return true;
    }
  }

  // Get token payload without verification
  getTokenPayload(token) {
    try {
      return jwt.decode(token);
    } catch (error) {
      return null;
    }
  }
}

module.exports = new JWTService();
