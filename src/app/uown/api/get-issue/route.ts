/**
 * Set ENV here: https://vercel.com/vprojectz-dev/web-portal/settings/environments/production
 */

import {App} from "@octokit/app";
import {NextResponse} from "next/server";

/// GET /uown/api/get-issue?issueNumber=123
export async function GET(req: Request) {
  // App key protection
  const appKey = req.headers.get("x-uown-app-key");
  if (appKey !== process.env.UOWN_APP_KEY) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  // Query param
  const { searchParams } = new URL(req.url);
  const issueNumber = searchParams.get("issueNumber");
  if (!issueNumber) return NextResponse.json({ error: "Missing [issueNumber]" }, { status: 400 });
  // GitHub App
  const app = new App({
    appId: process.env.UOWN_GITHUB_FEEDBACK_APP_ID!,
    privateKey: process.env.UOWN_GITHUB_FEEDBACK_APP_PRIVATE_KEY!,
  });
  const octokit = await app.getInstallationOctokit(
    Number(process.env.UOWN_GITHUB_FEEDBACK_APP_INSTALLATION_ID)
  );
  // Fetch issue
  const res = await octokit.request(
    "GET /repos/{owner}/{repo}/issues/{issue_number}",
    {
      owner: process.env.UOWN_GITHUB_FEEDBACK_APP_OWNER!,
      repo: process.env.UOWN_GITHUB_FEEDBACK_APP_REPO!,
      issue_number: Number(issueNumber),
    }
  );
  //
  return NextResponse.json(res.data);
}