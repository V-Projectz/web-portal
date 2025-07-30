import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/uown/server";
import { env } from "process";

///
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  // If "next" is in param, use it as the redirect URL
  let next = searchParams.get("next") ?? "/";
  if (!next.startsWith("/")) {
    // If "next" is not a relative URL, use the default
    next = "/";
  }
  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    //
    if (!error) {
      const forwardedHost = request.headers.get("x-forwarded-host"); // Original origin before load balancer
      const isDev = env.NODE_ENV === "development";
      //
      if (isDev) {
        // We can be sure that there is no load balancer in between, so no need to watch for X-Forwarded-Host
        return NextResponse.redirect(`${origin}${next}`);
      } else if (forwardedHost) {
        return NextResponse.redirect(`https://${forwardedHost}${next}`);
      } else {
        return NextResponse.redirect(`${origin}${next}`);
      }
    }
  }
  // Return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/auth/auth-code-error`);
}
