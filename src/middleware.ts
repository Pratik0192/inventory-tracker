import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose"

const JWT_SECRET = process.env.JWT_SECRET!;

function getJwtSecretKey() {
  if(!JWT_SECRET) throw new Error("JWT_SECRET is not defined");
  return new TextEncoder().encode(JWT_SECRET);
}

export async function middleware(req: NextRequest) {
  console.log("middleware running");

  const token = req.cookies.get("token")?.value;
  const url = req.nextUrl.clone();
  const pathname = req.nextUrl.pathname;

  if(!token) {
    if(
      pathname.startsWith("/common") || 
      pathname.startsWith("/process-coordinator")
    ) {
      url.pathname = "/";
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  try {
    const { payload } = await jwtVerify(token, getJwtSecretKey());
    const role = payload.role as string;

    if (pathname.startsWith("/common")) {
      if (role !== "ADMIN" && role !== "VENDOR") {
        url.pathname = "/process-coordinator";
        return NextResponse.redirect(url);
      }
    }

    if (pathname.startsWith("/process-coordinator")) {
      if (role !== "PROCESS_COORDINATOR") {
        url.pathname = "/common";
        return NextResponse.redirect(url);
      }
    }

    return NextResponse.next();
  } catch (err) {
    console.error("JWT verification failed:", err);
    url.pathname = "/";
    return NextResponse.redirect(url);
  }
}

export const config = {
  matcher: [
    "/common", 
    "/common/:path*", 
    "/process-coordinator", 
    "/process-coordinator/:path*"
  ],
}