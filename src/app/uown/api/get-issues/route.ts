/**
 * Set ENV here: https://vercel.com/vprojectz-dev/web-portal/settings/environments/production
 */

import {App} from "@octokit/app";
import { NextResponse } from "next/server";

/// GET /uown/api/get-issues?userId=xxx
export async function GET(req: Request) {
  // App key protection
  const appKey = req.headers.get("x-uown-app-key");
  if (appKey !== process.env.UOWN_APP_KEY) return NextResponse.json({ error: "Unauthorized" }, { status: 401});
  //
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");
  if (!userId) return NextResponse.json({ error: "Missing userId" }, { status: 400 });
  // Paging params
  const page = Number(searchParams.get("page") ?? "1");
  const perPage = Math.min(Number(searchParams.get("perPage") ?? "20"), 100);
  //
  const app = new App({
    appId: process.env.UOWN_GITHUB_FEEDBACK_APP_ID!,
    privateKey: process.env.UOWN_GITHUB_FEEDBACK_APP_PRIVATE_KEY!,
  });
  const octokit = await app.getInstallationOctokit(
    Number(process.env.UOWN_GITHUB_FEEDBACK_APP_INSTALLATION_ID)
  );
  //
  const res = await octokit.request(
    "GET /repos/{owner}/{repo}/issues",
    {
      owner: process.env.UOWN_GITHUB_FEEDBACK_APP_OWNER!,
      repo: process.env.UOWN_GITHUB_FEEDBACK_APP_REPO!,
      labels: `user:${userId}`,
      state: "all",
      page: page,
      per_page: perPage,
    }
  );

  return NextResponse.json(res.data);
}