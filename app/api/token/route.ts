import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Token validity: 5 minutes (enough time to scan and fill the form)
const TOKEN_VALIDITY_MS = 5 * 60 * 1000;

// Generate a random token
function generateToken(): string {
  return Math.random().toString(36).substring(2, 15) +
         Math.random().toString(36).substring(2, 15);
}

// Clean up expired tokens from database
async function cleanupExpiredTokens() {
  try {
    await prisma.token.deleteMany({
      where: {
        expiresAt: {
          lt: new Date()
        }
      }
    });
  } catch (error) {
    console.error('[Token] Error cleaning up expired tokens:', error);
  }
}

// GET - Get current valid token
export async function GET() {
  try {
    // Clean up expired tokens first
    await cleanupExpiredTokens();

    // Generate new token
    const token = generateToken();
    const now = new Date();
    const expiresAt = new Date(now.getTime() + TOKEN_VALIDITY_MS);

    // Store token in database
    await prisma.token.create({
      data: {
        token,
        expiresAt
      }
    });

    console.log(`[Token] Generated new token: ${token}, valid until ${expiresAt.toISOString()}`);

    return NextResponse.json({ token });
  } catch (error) {
    console.error('[Token] Error generating token:', error);
    return NextResponse.json({ error: 'Failed to generate token' }, { status: 500 });
  }
}

// POST - Validate a token
export async function POST(request: Request) {
  try {
    const { token } = await request.json();

    if (!token) {
      console.log('[Token] Validation failed: No token provided');
      return NextResponse.json({ valid: false, reason: 'No token provided' }, { status: 400 });
    }

    // Find token in database
    const tokenRecord = await prisma.token.findUnique({
      where: { token }
    });

    if (!tokenRecord) {
      console.log(`[Token] Validation failed: Token not found: ${token}`);
      return NextResponse.json({ valid: false, reason: 'Token not found' });
    }

    // Check if token is still valid
    const now = new Date();

    if (now > tokenRecord.expiresAt) {
      // Delete expired token
      await prisma.token.delete({ where: { token } });
      console.log(`[Token] Validation failed: Token expired: ${token}`);
      return NextResponse.json({ valid: false, reason: 'Token expired' });
    }

    console.log(`[Token] Validation success: ${token}`);
    return NextResponse.json({ valid: true });
  } catch (error) {
    console.error('[Token] Error validating token:', error);
    return NextResponse.json({ valid: false, reason: 'Server error' }, { status: 500 });
  }
}
