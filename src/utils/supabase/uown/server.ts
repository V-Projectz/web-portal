import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { serialize as serializeCookie } from "cookie";

///
export async function createClient() {
  const cookieStore = await cookies();
  const responseHeaders = new Headers(); // We'll need a Headers instance to capture Set-Cookie updates
  //
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        //
        getAll() {
          return cookieStore.getAll();
        },
        //
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              responseHeaders.append(
                "Set-Cookie",
                serializeCookie(name, value, options),
              ),
            );
          } catch (err) {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing user sessions.
            console.log(err);
          }
        },
      },
    },
  );
}
