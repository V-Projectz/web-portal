import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/uown/server";

///
async function handler(request: Request) {
  try {
    const { origin } = new URL(request.url);
    let code: string | null = null;
    let next = "/";
    // Read "code" depending on method
    if (request.method === "POST") {
      const body = await request.formData();
      code = body.get("code") as string | null;
      next = (body.get("next") as string) ?? "/";
    } else if (request.method === "GET") {
      const url = new URL(request.url);
      code = url.searchParams.get("code");
      next = url.searchParams.get("next") ?? "/";
    }
    //
    if (!next.startsWith("/")) next = "/";
    if (!code) throw new Error("Missing code from OAuth provider");
    // Exchange code for Supabase session
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (error) throw error;
    // Redirect user after login
    return NextResponse.redirect(new URL(next, origin));
  } catch (err) {
    console.error("OAuth callback error:", err);
    const { origin } = new URL(request.url);
    return NextResponse.redirect(new URL("/auth/uown/auth-code-error", origin), { status: 303 }); // 303 to force GET
  }
}

/// Handle all HTTP methods with the same handler
export const GET = handler;
export const POST = handler;
export const PUT = handler;     // Won't usually happen, but safe
export const DELETE = handler;  // Won't usually happen, but safe
export const PATCH = handler;   // Won't usually happen, but safe
export const OPTIONS = () => NextResponse.json({}, { status: 200 });