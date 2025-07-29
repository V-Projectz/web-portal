import type { NextApiRequest, NextApiResponse } from "next";
import { createClient } from "@/utils/supabase/uown/server";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { code, next: nextParam } = req.query;
  const next = typeof nextParam === "string" && nextParam.startsWith("/") ? nextParam : "/";

  if (!code || typeof code !== "string") return res.redirect("/auth/auth-code-error");

  const supabase = await createClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) return res.redirect("/auth/auth-code-error");

  const host = req.headers["x-forwarded-host"] || req.headers.host || "localhost:3000";
  const proto = req.headers["x-forwarded-proto"] || "https";

  return res.redirect(`${proto}://${host}${next}`);
}