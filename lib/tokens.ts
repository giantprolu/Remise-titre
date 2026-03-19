// Shared in-memory token store (module singleton)
export const validTokens = new Map<string, number>();

export const TOKEN_VALIDITY_MS = 90000; // 90 seconds

export function generateToken(): string {
  return Math.random().toString(36).substring(2, 15) +
         Math.random().toString(36).substring(2, 15);
}

export function createToken(): string {
  cleanupExpiredTokens();
  const token = generateToken();
  validTokens.set(token, Date.now());
  return token;
}

export function validateToken(token: string): { valid: boolean; reason?: string } {
  const timestamp = validTokens.get(token);
  if (!timestamp) return { valid: false, reason: 'Token not found' };
  if (Date.now() - timestamp > TOKEN_VALIDITY_MS) {
    validTokens.delete(token);
    return { valid: false, reason: 'Token expired' };
  }
  return { valid: true };
}

export function cleanupExpiredTokens() {
  const now = Date.now();
  for (const [token, timestamp] of validTokens.entries()) {
    if (now - timestamp > TOKEN_VALIDITY_MS) {
      validTokens.delete(token);
    }
  }
}
