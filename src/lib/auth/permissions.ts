/**
 * Permission Checking Utilities
 *
 * Functions to verify user permissions for specific actions.
 */

import { OrganizationRole, Schema } from '@prisma/client';
import { hasMinimumRole } from './middleware';

/**
 * Check if user can create schemas
 */
export function canCreateSchema(role: OrganizationRole): boolean {
  return hasMinimumRole(role, 'MEMBER');
}

/**
 * Check if user can edit a schema
 */
export function canEditSchema(userId: string, schema: Schema, role: OrganizationRole): boolean {
  // Owner of schema can always edit
  if (schema.createdBy === userId) {
    return true;
  }

  // Admin or Owner role can edit any schema
  return hasMinimumRole(role, 'ADMIN');
}

/**
 * Check if user can delete a schema
 */
export function canDeleteSchema(role: OrganizationRole): boolean {
  return hasMinimumRole(role, 'ADMIN');
}

/**
 * Check if user can create projects
 */
export function canCreateProject(role: OrganizationRole): boolean {
  return hasMinimumRole(role, 'MEMBER');
}

/**
 * Check if user can edit any project
 */
export function canEditAnyProject(role: OrganizationRole): boolean {
  return hasMinimumRole(role, 'ADMIN');
}

/**
 * Check if user can delete projects
 */
export function canDeleteProject(role: OrganizationRole): boolean {
  return hasMinimumRole(role, 'ADMIN');
}

/**
 * Check if user can create data entries
 */
export function canCreateData(role: OrganizationRole): boolean {
  return hasMinimumRole(role, 'MEMBER');
}

/**
 * Check if user can edit their own data
 */
export function canEditOwnData(userId: string, createdBy: string, role: OrganizationRole): boolean {
  if (createdBy === userId) {
    return hasMinimumRole(role, 'MEMBER');
  }
  return hasMinimumRole(role, 'ADMIN');
}

/**
 * Check if user can edit any data
 */
export function canEditAnyData(role: OrganizationRole): boolean {
  return hasMinimumRole(role, 'ADMIN');
}

/**
 * Check if user can delete data
 */
export function canDeleteData(role: OrganizationRole): boolean {
  return hasMinimumRole(role, 'ADMIN');
}

/**
 * Check if user can invite members to organization
 */
export function canInviteMembers(role: OrganizationRole): boolean {
  return hasMinimumRole(role, 'ADMIN');
}

/**
 * Check if user can manage roles in organization
 */
export function canManageRoles(role: OrganizationRole): boolean {
  return hasMinimumRole(role, 'OWNER');
}

/**
 * Check if user can delete organization
 */
export function canDeleteOrganization(role: OrganizationRole): boolean {
  return hasMinimumRole(role, 'OWNER');
}
