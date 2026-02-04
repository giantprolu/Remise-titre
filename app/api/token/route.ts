import { NextResponse } from 'next/server';

// In-memory store for valid tokens
// Each token is valid for 90 seconds (enough time to scan and start filling the form)
// Note: In serverless environments, this Map persists only during the function's lifetime
const validTokens = new Map<string, number>();

const TOKEN_VALIDITY_MS = 90000; // 90 seconds

// Generate a random token
function generateToken(): string {
  return Math.random().toString(36).substring(2, 15) +
         Math.random().toString(36).substring(2, 15);
}

// Clean up expired tokens
function cleanupExpiredTokens() {
  const now = Date.now();
  for (const [token, timestamp] of validTokens.entries()) {
    if (now - timestamp > TOKEN_VALIDITY_MS) {
      validTokens.delete(token);
    }
  }
}

// GET - Get current valid token
export async function GET() {
  // Clean up expired tokens first
  cleanupExpiredTokens();

  // Generate new token
  const token = generateToken();
  const timestamp = Date.now();

  // Store token with timestamp
  validTokens.set(token, timestamp);

  console.log(`[Token] Generated new token: ${token}, valid until ${new Date(timestamp + TOKEN_VALIDITY_MS).toISOString()}`);
  console.log(`[Token] Currently ${validTokens.size} active tokens`);

  return NextResponse.json({ token });
}

// POST - Validate a token
export async function POST(request: Request) {
  try {
    const { token } = await request.json();

    if (!token) {
      console.log('[Token] Validation failed: No token provided');
      return NextResponse.json({ valid: false, reason: 'No token provided' }, { status: 400 });
    }

    const timestamp = validTokens.get(token);

    if (!timestamp) {
      console.log(`[Token] Validation failed: Token not found: ${token}`);
      return NextResponse.json({ valid: false, reason: 'Token not found' });
    }

    // Check if token is still valid
    const now = Date.now();
    const age = now - timestamp;

    if (age > TOKEN_VALIDITY_MS) {
      validTokens.delete(token);
      console.log(`[Token] Validation failed: Token expired (age: ${age}ms): ${token}`);
      return NextResponse.json({ valid: false, reason: 'Token expired' });
    }

    console.log(`[Token] Validation success: ${token} (age: ${age}ms)`);
    return NextResponse.json({ valid: true });
  } catch (error) {
    console.error('[Token] Error validating token:', error);
    return NextResponse.json({ valid: false, reason: 'Server error' }, { status: 500 });
  }
}
