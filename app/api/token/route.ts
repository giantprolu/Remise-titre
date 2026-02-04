import { NextResponse } from 'next/server';

// In-memory store for valid tokens
// Each token is valid for 60 seconds (enough time to scan and start filling the form)
const validTokens = new Map<string, number>();

// Clean up old tokens every minute
setInterval(() => {
  const now = Date.now();
  for (const [token, timestamp] of validTokens.entries()) {
    if (now - timestamp > 60000) { // 60 seconds
      validTokens.delete(token);
    }
  }
}, 60000);

// Generate a random token
function generateToken(): string {
  return Math.random().toString(36).substring(2, 15) +
         Math.random().toString(36).substring(2, 15);
}

// GET - Get current valid token
export async function GET() {
  // Generate new token
  const token = generateToken();
  const timestamp = Date.now();

  // Store token
  validTokens.set(token, timestamp);

  // Clean up tokens older than 60 seconds
  for (const [t, ts] of validTokens.entries()) {
    if (timestamp - ts > 60000) {
      validTokens.delete(t);
    }
  }

  return NextResponse.json({ token });
}

// POST - Validate a token
export async function POST(request: Request) {
  try {
    const { token } = await request.json();

    if (!token) {
      return NextResponse.json({ valid: false }, { status: 400 });
    }

    const timestamp = validTokens.get(token);

    if (!timestamp) {
      return NextResponse.json({ valid: false, reason: 'Token not found' });
    }

    // Check if token is still valid (within 60 seconds)
    const now = Date.now();
    const age = now - timestamp;

    if (age > 60000) {
      validTokens.delete(token);
      return NextResponse.json({ valid: false, reason: 'Token expired' });
    }

    return NextResponse.json({ valid: true });
  } catch (error) {
    console.error('Error validating token:', error);
    return NextResponse.json({ valid: false }, { status: 500 });
  }
}
