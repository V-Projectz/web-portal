// import { NextResponse } from "next/server";
// import { createClient } from "@/utils/supabase/uown/server";

// ///
// export async function GET(request: Request) {
//   const { searchParams, origin } = new URL(request.url);
//   const code = searchParams.get("code");
//   // If "next" is in param, use it as the redirect URL
//   let next = searchParams.get("next") ?? "/";
//   if (!next.startsWith('/')) {
//     next = "/";
//   }
//   //
//   if (code) {
//     const supabase = await createClient();
//     const { error } = await supabase.auth.exchangeCodeForSession(code);
//     //
//     if (!error) {
//       const forwardedHost = request.headers.get("x-forwarded-host") // Original origin before load balancer
//       const isLocalEnv = process.env.NODE_ENV === "development";
//       if (isLocalEnv) {
//         // We can be sure that there is no load balancer in between, so no need to watch for X-Forwarded-Host
//         return NextResponse.redirect(`${origin}${next}`);
//       } else if (forwardedHost) {
//         return NextResponse.redirect(`https://${forwardedHost}${next}`);
//       } else {
//         return NextResponse.redirect(`${origin}${next}`);
//       }
//     }
//   }
//   // Return the user to an error page with instructions
//   return NextResponse.redirect(`${origin}/auth/auth-code-error`);
// }

import type { NextApiRequest, NextApiResponse } from "next";
import { createClient } from "@/utils/supabase/uown/server";

///
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { code, next: nextParam } = req.query;
  const nextUrl =
    typeof nextParam === "string" && nextParam.startsWith("/")
      ? nextParam
      : "/";
  //
  if (!code || typeof code !== "string") {
    return res.redirect("/auth/auth-code-error");
  }
  //
  const supabase = await createClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);
  //
  if (error) {
    return res.redirect("/auth/auth-code-error");
  }
  // Use headers or env to detect host if needed, simplified here:
  const host =
    req.headers["x-forwarded-host"] || req.headers.host || "localhost:3000";
  const protocol = req.headers["x-forwarded-proto"] || "https";
  //
  return res.redirect(`${protocol}://${host}${nextUrl}`);
}
