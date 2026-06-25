import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const REALM = 'KMP Dashboard';

function unauthorized(message: string) {
  return new NextResponse(message, {
    status: 401,
    headers: { 'WWW-Authenticate': `Basic realm="${REALM}"` },
  });
}

export function proxy(request: NextRequest) {
  const expectedUser = process.env.AUTH_USER;
  const expectedPass = process.env.AUTH_PASS;

  if (!expectedUser || !expectedPass) {
    return new NextResponse('Auth not configured', { status: 500 });
  }

  const authHeader = request.headers.get('authorization');
  if (!authHeader) {
    return unauthorized('Authentication required');
  }

  const [scheme, encoded] = authHeader.split(' ');
  if (scheme !== 'Basic' || !encoded) {
    return unauthorized('Invalid authentication');
  }

  let decoded: string;
  try {
    decoded = atob(encoded);
  } catch {
    return unauthorized('Invalid authentication');
  }

  const sepIndex = decoded.indexOf(':');
  if (sepIndex === -1) {
    return unauthorized('Invalid credentials');
  }
  const user = decoded.slice(0, sepIndex);
  const pass = decoded.slice(sepIndex + 1);

  if (user !== expectedUser || pass !== expectedPass) {
    return unauthorized('Invalid credentials');
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
