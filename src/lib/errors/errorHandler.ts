/**
 * Global Error Handler
 *
 * Centralized error handling for API routes with proper logging and formatting.
 */

import { Prisma } from '@prisma/client';
import { ZodError } from 'zod';
import { AppError, ValidationError, ConflictError, NotFoundError, DatabaseError } from './AppError';

interface ErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
}

/**
 * Handle Prisma database errors
 */
function handlePrismaError(error: Prisma.PrismaClientKnownRequestError): AppError {
  switch (error.code) {
    case 'P2002': {
      // Unique constraint violation
      const field = (error.meta?.target as string[])?.join(', ') || 'field';
      return new ConflictError(`${field} already exists`, { field });
    }
    case 'P2025': {
      // Record not found
      return new NotFoundError('Record not found');
    }
    case 'P2003': {
      // Foreign key constraint violation
      return new ValidationError('Invalid reference', { field: error.meta?.field_name });
    }
    default: {
      return new DatabaseError('Database operation failed');
    }
  }
}

/**
 * Handle Zod validation errors
 */
function handleZodError(error: ZodError): ValidationError {
  const details: Record<string, string> = {};

  error.errors.forEach((err) => {
    const path = err.path.join('.');
    details[path] = err.message;
  });

  return new ValidationError('Validation failed', details);
}

/**
 * Format error into standardized response
 */
export function formatErrorResponse(error: unknown): ErrorResponse {
  // Handle AppError instances
  if (error instanceof AppError) {
    return {
      success: false,
      error: {
        code: error.code,
        message: error.message,
        ...(error.details && { details: error.details }),
      },
    };
  }

  // Handle Prisma errors
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    const appError = handlePrismaError(error);
    return formatErrorResponse(appError);
  }

  // Handle Zod validation errors
  if (error instanceof ZodError) {
    const appError = handleZodError(error);
    return formatErrorResponse(appError);
  }

  // Handle unknown errors
  console.error('Unhandled error:', error);

  return {
    success: false,
    error: {
      code: 'INTERNAL_SERVER_ERROR',
      message: process.env.NODE_ENV === 'production'
        ? 'An unexpected error occurred'
        : error instanceof Error
        ? error.message
        : 'Unknown error',
    },
  };
}

/**
 * Get HTTP status code from error
 */
export function getErrorStatusCode(error: unknown): number {
  if (error instanceof AppError) {
    return error.statusCode;
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    const appError = handlePrismaError(error);
    return appError.statusCode;
  }

  if (error instanceof ZodError) {
    return 400;
  }

  return 500;
}
