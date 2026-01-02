/**
 * Set ENV here: https://vercel.com/vprojectz-dev/web-portal/settings/environments/production
 */

import {App} from "@octokit/app";

/// GET /uown/api/get-issues?userId=xxx
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");
  //
  if (!userId) {
    return Response.json({ error: "Missing userId" }, { status: 400 });
  }
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
    }
  );

  return Response.json(res.data);
}