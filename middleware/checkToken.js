const jwtService = require('../service/jwtService');
const User = require('../model/User');

class AuthMiddleware {
  // Verify JWT token and attach user to request
  authenticateToken = async (req, res, next) => {
    try {
      const authHeader = req.headers.authorization;
      const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

      if (!token) {
        return res.status(401).json({
          success: false,
          message: 'Access token is required',
          code: 'MISSING_TOKEN'
        });
      }

      // Verify token
      const decoded = jwtService.verifyAccessToken(token);
      
      // Check if token is expired
      if (jwtService.isTokenExpired(token)) {
        return res.status(401).json({
          success: false,
          message: 'Token has expired',
          code: 'TOKEN_EXPIRED'
        });
      }

      // Attach user info to request
      req.user = {
        id: decoded.id,
        email: decoded.email,
        role: decoded.role
      };

      next();
    } catch (error) {
      console.error('Token verification error:', error.message);
      
      if (error.message === 'Invalid access token') {
        return res.status(401).json({
          success: false,
          message: 'Invalid or malformed token',
          code: 'INVALID_TOKEN'
        });
      }

      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({
          success: false,
          message: 'Token has expired',
          code: 'TOKEN_EXPIRED'
        });
      }

      return res.status(500).json({
        success: false,
        message: 'Internal server error during authentication',
        code: 'AUTH_ERROR'
      });
    }
  };

  // Optional authentication - doesn't fail if no token
  optionalAuth = async (req, res, next) => {
    try {
      const authHeader = req.headers.authorization;
      const token = authHeader && authHeader.split(' ')[1];

      if (token) {
        try {
          const decoded = jwtService.verifyAccessToken(token);
          req.user = {
            id: decoded.id,
            email: decoded.email,
            role: decoded.role
          };
        } catch (error) {
          // Token is invalid but we don't fail the request
          console.warn('Invalid token in optional auth:', error.message);
        }
      }

      next();
    } catch (error) {
      next();
    }
  };

  // Check if user has required role
  requireRole = (roles) => {
    return (req, res, next) => {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required',
          code: 'AUTH_REQUIRED'
        });
      }

      const userRole = req.user.role;
      const allowedRoles = Array.isArray(roles) ? roles : [roles];

      if (!allowedRoles.includes(userRole)) {
        return res.status(403).json({
          success: false,
          message: 'Insufficient permissions',
          code: 'INSUFFICIENT_PERMISSIONS'
        });
      }

      next();
    };
  };

  // Check if user is admin
  requireAdmin = (req, res, next) => {
    return this.requireRole(1)(req, res, next); // Assuming role 1 is admin
  };

  // Check if user is regular user
  requireUser = (req, res, next) => {
    return this.requireRole([1, 2])(req, res, next); // Admin or regular user
  };

  // Rate limiting for authentication endpoints
  authRateLimit = (req, res, next) => {
    // This would typically be implemented with a rate limiting library
    // For now, we'll add a basic check
    const clientIP = req.ip || req.connection.remoteAddress;
    
    // You can implement more sophisticated rate limiting here
    // For example, using Redis to track attempts per IP
    
    next();
  };

  // Validate refresh token
  validateRefreshToken = async (req, res, next) => {
    try {
      const { refreshToken } = req.body;

      if (!refreshToken) {
        return res.status(400).json({
          success: false,
          message: 'Refresh token is required',
          code: 'MISSING_REFRESH_TOKEN'
        });
      }

      const decoded = jwtService.verifyRefreshToken(refreshToken);
      
      // Check if token is expired
      if (jwtService.isTokenExpired(refreshToken)) {
        return res.status(401).json({
          success: false,
          message: 'Refresh token has expired',
          code: 'REFRESH_TOKEN_EXPIRED'
        });
      }

      req.refreshTokenData = decoded;
      next();
    } catch (error) {
      console.error('Refresh token validation error:', error.message);
      
      return res.status(401).json({
        success: false,
        message: 'Invalid refresh token',
        code: 'INVALID_REFRESH_TOKEN'
      });
    }
  };

  // Log authentication attempts
  logAuthAttempt = (req, res, next) => {
    const clientIP = req.ip || req.connection.remoteAddress;
    const userAgent = req.get('User-Agent');
    const timestamp = new Date().toISOString();

    console.log(`[AUTH] ${timestamp} - IP: ${clientIP} - User-Agent: ${userAgent} - Endpoint: ${req.method} ${req.path}`);

    next();
  };

  // Check if user account is active
  requireActiveAccount = async (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required',
          code: 'AUTH_REQUIRED'
        });
      }

      // You would typically fetch the user from database to check status
      // For now, we'll assume the user is active if they have a valid token
      
      next();
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Error checking account status',
        code: 'ACCOUNT_STATUS_ERROR'
      });
    }
  };
}

module.exports = new AuthMiddleware();
