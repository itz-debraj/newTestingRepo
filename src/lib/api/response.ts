/**
 * Standardized API Response Helpers
 *
 * Functions for creating consistent API responses across all endpoints.
 */

import { NextResponse } from 'next/server';

interface SuccessResponse<T = unknown> {
  success: true;
  data: T;
}

interface ErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
}

/**
 * Create a success response
 *
 * @param data - Response data
 * @param status - HTTP status code (default: 200)
 * @returns NextResponse with success format
 */
export function success<T>(data: T, status = 200): NextResponse<SuccessResponse<T>> {
  return NextResponse.json(
    {
      success: true,
      data,
    },
    { status }
  );
}

/**
 * Create an error response
 *
 * @param code - Error code
 * @param message - Error message
 * @param status - HTTP status code (default: 400)
 * @param details - Optional error details
 * @returns NextResponse with error format
 */
export function error(
  code: string,
  message: string,
  status = 400,
  details?: unknown
): NextResponse<ErrorResponse> {
  return NextResponse.json(
    {
      success: false,
      error: {
        code,
        message,
        ...(details && { details }),
      },
    },
    { status }
  );
}
