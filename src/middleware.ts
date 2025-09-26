import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from 'jose';

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};

const publicRoutes = ['/auth/signup', '/auth/signup/verify', '/auth/signup/documents', '/auth/signin', '/auth/verification-pending'];

export async function middleware(req: NextRequest) {
    const pathname = req.nextUrl.pathname;
    const method = req.method;
    
    console.log(`🔍 [MIDDLEWARE] ${method} ${pathname} - Starting middleware check`);
    
    const isPublic = publicRoutes.includes(pathname);
    console.log(`📋 [MIDDLEWARE] Route ${pathname} is ${isPublic ? 'PUBLIC' : 'PROTECTED'}`);
    
    // The config matcher determines which routes the middleware runs on
    // We don't need to check it here since Next.js already filtered the routes
    console.log(`🎯 [MIDDLEWARE] Middleware running for ${pathname} (matched by config)`);

    if (isPublic) {
        console.log(`✅ [MIDDLEWARE] Public route ${pathname} - allowing access`);
        return NextResponse.next();
    }

    console.log(`🔒 [MIDDLEWARE] Protected route ${pathname} - checking authentication`);

    // Check for token in cookies
    const token = req.cookies.get('token')?.value;
    
    if (!token) {
        console.log(`❌ [MIDDLEWARE] No token found in cookies - redirecting to signin`);
        return NextResponse.redirect(new URL('/auth/signin', req.url));
    }

    console.log(`🎫 [MIDDLEWARE] Token found: ${token.substring(0, 20)}...`);

    try {
        // Verify JWT token
        console.log(`🔐 [MIDDLEWARE] Verifying JWT token...`);
        console.log(`🔑 [MIDDLEWARE] Using JWT secret: ${process.env.JWT_SECRET || 'some-jwt-secret'}`);
        const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'some-jwt-secret');
        
        // Explicitly specify HS256 algorithm to match backend
        const result = await jwtVerify(token, secret, {
          algorithms: ['HS256']
        });
        
        console.log(`✅ [MIDDLEWARE] JWT token verified successfully for user:`, result.payload);
        console.log(`🚀 [MIDDLEWARE] Allowing access to ${pathname}`);
        
        return NextResponse.next();
    } catch (error) {
        // Invalid token, redirect to signin
        console.log(`❌ [MIDDLEWARE] JWT token verification failed:`, error);
        console.log(`🔄 [MIDDLEWARE] Redirecting to signin page`);
        return NextResponse.redirect(new URL('/auth/signin', req.url));
    }
}