import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/uown/server";

///
export async function GET(request: Request) {
  return handleCallback(request);
}

///
export async function POST(request: Request) {
  return handleCallback(request);
}

///
async function handleCallback(request: Request) {
  try {
    const { searchParams, origin } = new URL(request.url);
    // Get the code from authenticator callback
    const code = searchParams.get("code");
    if (!code) throw new Error("Missing code");
    // Next URL after login
    let next = searchParams.get("next") ?? "/";
    if (!next.startsWith("/")) next = "/";
    //
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (error) throw error;
    // Redirect to next page using absolute URL
    return NextResponse.redirect(new URL(next, origin));
  } catch (err) {
    console.error("Auth callback error, ", err);
    // Always use absolute URL in App Router
    const { origin } = new URL(request.url);
    return NextResponse.redirect(new URL("/auth/uown/auth-code-error", origin));
  }
}
