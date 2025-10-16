/**
 * Password Hashing and Verification
 *
 * Functions for securely hashing and comparing passwords using bcrypt.
 */

import bcrypt from 'bcryptjs';

const SALT_ROUNDS = 12;

/**
 * Hash a password using bcrypt
 *
 * @param password - Plain text password to hash
 * @returns Promise with hashed password
 */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

/**
 * Compare a plain text password with a hashed password
 *
 * @param password - Plain text password
 * @param hash - Hashed password from database
 * @returns Promise with boolean indicating if passwords match
 */
export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}
