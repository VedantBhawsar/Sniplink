import { createHash } from 'crypto';
import { base64url } from 'jose';

export function generateShortLink(originalUrl: string): string {
  // SHA256 hash as Uint8Array
  const hash = createHash('sha256').update(originalUrl).digest();

  // take first 6 bytes (48 bits entropy)
  const shortBytes = hash.slice(0, 6);

  // encode to url-safe string
  const shortCode = base64url.encode(shortBytes);

  return shortCode;
}

export async function generateUniqueShortUrl(
  originalUrl: string,
  
): Promise<string> {
  const salt = `-${Date.now()}-${Math.random()}`;
  const input = `${originalUrl}${salt}`;

  return generateShortLink(input);
}
