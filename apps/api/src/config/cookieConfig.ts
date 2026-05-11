import type { CookieOptions } from 'express';

/**
 * Cookie configuration for secure, HttpOnly cookies.
 *
 * Cross-origin setup (e.g. localhost frontend + Render backend):
 * - sameSite must be 'none' so the browser sends the cookie on cross-site requests.
 *   'strict' / 'lax' silently drop the cookie when origin !== backend domain.
 * - secure must be true whenever sameSite is 'none' (browser requirement).
 * - domain must NOT be set — setting it to a public-suffix domain like
 *   '.onrender.com' causes browsers to reject the cookie outright.
 */

// Use SECURE_COOKIES=true to enable SameSite=None + Secure cookies for
// cross-origin requests (e.g. localhost frontend ↔ Render backend) without
// having to set NODE_ENV=production. Falls back to NODE_ENV check.
const isSecure =
  process.env.SECURE_COOKIES === 'true' || process.env.NODE_ENV === 'production';

/**
 * Secure cookie options for access token
 * - HttpOnly: Prevents JavaScript access, protects against XSS
 * - Secure: Only sent over HTTPS
 * - SameSite 'none': Required for cross-site requests (localhost ↔ Render)
 * - Path: Scoped to API routes
 */
export const accessTokenCookieOptions: CookieOptions = {
  httpOnly: true,
  secure: isSecure,       // Must be true when sameSite is 'none'
  sameSite: isSecure ? 'none' : 'lax',  // 'none' for cross-origin, 'lax' for local dev
  path: '/api',
  maxAge: 15 * 60 * 1000,    // 15 minutes
  // domain intentionally omitted — let the browser use the response origin
};

/**
 * Secure cookie options for refresh token
 * - Longer expiration than access token
 * - Stricter path for additional security
 */
export const refreshTokenCookieOptions: CookieOptions = {
  httpOnly: true,
  secure: isSecure,
  sameSite: isSecure ? 'none' : 'lax',
  path: '/api/v1/auth/refresh',
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  // domain intentionally omitted
};

/**
 * Cookie names for storing tokens
 */
export const COOKIE_NAMES = {
  ACCESS_TOKEN: 'accessToken',
  REFRESH_TOKEN: 'refreshToken',
} as const;

/**
 * Clear cookie options (used for logout)
 */
export const clearCookieOptions: CookieOptions = {
  httpOnly: true,
  secure: isSecure,
  sameSite: isSecure ? 'none' : 'lax',
  path: '/api',
  // domain intentionally omitted
};

export const clearRefreshCookieOptions: CookieOptions = {
  httpOnly: true,
  secure: isSecure,
  sameSite: isSecure ? 'none' : 'lax',
  path: '/api/v1/auth/refresh',
  // domain intentionally omitted
};
