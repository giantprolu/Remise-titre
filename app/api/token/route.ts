import { NextResponse } from 'next/server';
import { createToken, validateToken } from '@/lib/tokens';

// GET - Generate and return a new valid token
export async function GET() {
  const token = createToken();
  console.log(`[Token] Generated: ${token}`);
  return NextResponse.json({ token });
}

// POST - Validate a token
export async function POST(request: Request) {
  try {
    const { token } = await request.json();

    if (!token) {
      return NextResponse.json({ valid: false, reason: 'No token provided' }, { status: 400 });
    }

    const result = validateToken(token);
    console.log(`[Token] Validation ${result.valid ? 'success' : 'failed'}: ${token}`);
    return NextResponse.json(result);
  } catch (error) {
    console.error('[Token] Error validating token:', error);
    return NextResponse.json({ valid: false, reason: 'Server error' }, { status: 500 });
  }
}
