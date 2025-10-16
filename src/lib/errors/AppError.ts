/**
 * Custom Application Error Classes
 *
 * Hierarchy of error classes for structured error handling throughout the application.
 */

/**
 * Base application error class
 */
export class AppError extends Error {
  public readonly statusCode: number;
  public readonly code: string;
  public readonly isOperational: boolean;
  public readonly details?: unknown;

  constructor(
    message: string,
    statusCode: number,
    code: string,
    isOperational = true,
    details?: unknown
  ) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.isOperational = isOperational;
    this.details = details;

    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }

    this.name = this.constructor.name;
  }
}

/**
 * Validation error (400)
 */
export class ValidationError extends AppError {
  constructor(message: string, details?: unknown) {
    super(message, 400, 'VALIDATION_ERROR', true, details);
  }
}

/**
 * Authentication error (401)
 */
export class AuthenticationError extends AppError {
  constructor(message: string = 'Authentication required') {
    super(message, 401, 'AUTHENTICATION_ERROR', true);
  }
}

/**
 * Authorization error (403)
 */
export class AuthorizationError extends AppError {
  constructor(message: string = 'Insufficient permissions') {
    super(message, 403, 'AUTHORIZATION_ERROR', true);
  }
}

/**
 * Not found error (404)
 */
export class NotFoundError extends AppError {
  constructor(message: string = 'Resource not found') {
    super(message, 404, 'NOT_FOUND', true);
  }
}

/**
 * Conflict error (409) - e.g., duplicate email
 */
export class ConflictError extends AppError {
  constructor(message: string, details?: unknown) {
    super(message, 409, 'CONFLICT', true, details);
  }
}

/**
 * Rate limit error (429)
 */
export class RateLimitError extends AppError {
  constructor(message: string = 'Too many requests') {
    super(message, 429, 'RATE_LIMIT_EXCEEDED', true);
  }
}

/**
 * Database error (500)
 */
export class DatabaseError extends AppError {
  constructor(message: string = 'Database error', details?: unknown) {
    super(message, 500, 'DATABASE_ERROR', false, details);
  }
}
