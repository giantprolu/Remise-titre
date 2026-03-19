import { NextRequest, NextResponse } from 'next/server';
import { createToken } from '@/lib/tokens';

// Redirect to participate page with a fresh token.
// This is the URL printed on physical QR codes.
export async function GET(request: NextRequest) {
  const token = createToken();
  const origin = request.nextUrl.origin;
  return NextResponse.redirect(`${origin}/participate?token=${token}`);
}
