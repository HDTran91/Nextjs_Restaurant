import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'


const privatePath = ['/me']
const authPath = ['/login', '/register']
const productEditRegex = /^\/products\/\d+\/edit$/ // Matches paths like /products/123/edit
// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  const pathname = request.nextUrl
  const sessionToken = request.cookies.get('sessionToken')?.value
  //check private path
  if (privatePath.some((path) => pathname.pathname.startsWith(path)) && !sessionToken) {
    //redirect to login page
    return NextResponse.redirect(new URL('/login', request.url))
  }
  //check auth path
  if (authPath.some((path) => pathname.pathname.startsWith(path)) && sessionToken) {
    //redirect to home page
    return NextResponse.redirect(new URL('/me', request.url))
  }
  if(pathname.pathname.match(productEditRegex) && !sessionToken) {
    return NextResponse.redirect(new URL('/login', request.url))

  }
  return NextResponse.next()
}



// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    '/me', '/login', '/register','/products/:path*'
  ],
}