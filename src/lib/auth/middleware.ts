/**
 * Authentication and Authorization Middleware
 *
 * Middleware functions for protecting API routes and verifying user permissions.
 */

import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken, extractTokenFromHeader } from './jwt';
import { getAccessToken } from './cookies';
import { AuthenticationError, AuthorizationError } from '@/lib/errors/AppError';
import { OrganizationRole } from '@prisma/client';

export interface AuthenticatedUser {
  userId: string;
  email: string;
  organizationId: string;
  role: string;
}

/**
 * Require authentication - verifies JWT token and returns user
 *
 * @param request - Next.js request object
 * @returns Authenticated user information
 * @throws AuthenticationError if token is missing or invalid
 */
export async function requireAuth(request: NextRequest): Promise<AuthenticatedUser> {
  // Try to get token from Authorization header first
  const authHeader = request.headers.get('authorization');
  let token = extractTokenFromHeader(authHeader || '');

  // If not in header, try to get from cookies
  if (!token) {
    token = await getAccessToken();
  }

  if (!token) {
    throw new AuthenticationError('No authentication token provided');
  }

  try {
    const payload = verifyToken(token);
    return {
      userId: payload.userId,
      email: payload.email,
      organizationId: payload.organizationId,
      role: payload.role,
    };
  } catch (error) {
    throw new AuthenticationError('Invalid or expired token');
  }
}

/**
 * Require organization membership - verifies user belongs to organization
 *
 * @param userId - User ID
 * @param organizationId - Organization ID to verify
 * @returns Organization role
 * @throws AuthorizationError if user doesn't belong to organization
 */
export async function requireOrganization(
  userId: string,
  organizationId: string
): Promise<OrganizationRole> {
  const membership = await prisma.userOrganization.findUnique({
    where: {
      userId_organizationId: {
        userId,
        organizationId,
      },
    },
  });

  if (!membership) {
    throw new AuthorizationError('User does not belong to this organization');
  }

  return membership.role;
}

/**
 * Require minimum role - verifies user has sufficient permissions
 *
 * @param userRole - User's current role
 * @param minimumRole - Minimum required role
 * @throws AuthorizationError if user doesn't have sufficient role
 */
export function requireRole(userRole: OrganizationRole, minimumRole: OrganizationRole): void {
  const roleHierarchy: Record<OrganizationRole, number> = {
    VIEWER: 1,
    MEMBER: 2,
    ADMIN: 3,
    OWNER: 4,
  };

  if (roleHierarchy[userRole] < roleHierarchy[minimumRole]) {
    throw new AuthorizationError(`This action requires ${minimumRole} role or higher`);
  }
}

/**
 * Check if user has minimum role
 *
 * @param userRole - User's current role
 * @param minimumRole - Minimum required role
 * @returns Boolean indicating if user has sufficient role
 */
export function hasMinimumRole(userRole: OrganizationRole, minimumRole: OrganizationRole): boolean {
  const roleHierarchy: Record<OrganizationRole, number> = {
    VIEWER: 1,
    MEMBER: 2,
    ADMIN: 3,
    OWNER: 4,
  };

  return roleHierarchy[userRole] >= roleHierarchy[minimumRole];
}
