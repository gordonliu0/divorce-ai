import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";
import { hasEnvVars } from "../utils";
import { getSupabaseEnv } from "./env";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  if (!hasEnvVars) {
    return supabaseResponse;
  }

  const { url, key } = getSupabaseEnv();
  const supabase = createServerClient(url, key, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        for (const { name, value } of cookiesToSet) {
          request.cookies.set(name, value);
        }
        supabaseResponse = NextResponse.next({
          request,
        });
        for (const { name, value, options } of cookiesToSet) {
          supabaseResponse.cookies.set(name, value, options);
        }
      },
    },
  });

  const { data: userData } = await supabase.auth.getUser();
  const user = userData?.user;

  const pathname = request.nextUrl.pathname;

  const publicPaths = [
    "/",
    "/auth",
    "/invite",
    "/tos",
    "/privacy",
    "/contact",
    "/pricing",
  ];

  const isPublicPath = publicPaths.some((path) => pathname.startsWith(path));
  const isProtectedPath = pathname.startsWith("/o");

  // Redirect unauthenticated users trying to access protected routes
  if (!user && isProtectedPath) {
    const url = request.nextUrl.clone();
    url.pathname = "/auth/login";
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}
