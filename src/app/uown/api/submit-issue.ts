/**
 * Set ENV here: https://vercel.com/vprojectz-dev/web-portal/settings/environments/production
 */
import { App } from "@octokit/app";
import type { VercelRequest, VercelResponse } from "@vercel/node";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  //
  if (req.method !== "POST") {
    return res.status(405).end();
  }
  //
  const { title, body, userId } = req.body;
  const app = new App({
    appId: process.env.UOWN_GITHUB_FEEDBACK_APP_ID!,
    privateKey: process.env.UOWN_GITHUB_FEEDBACK_APP_PRIVATE_KEY!,
  });
  const octokit = await app.getInstallationOctokit(
    Number(process.env.UOWN_GITHUB_FEEDBACK_APP_INSTALLATION_ID)
  );
  //
  const issue = await octokit.request("POST /repos/{owner}/{repo}/issues", {
    owner: process.env.UOWN_GITHUB_FEEDBACK_APP_OWNER!,
    repo: process.env.UOWN_GITHUB_FEEDBACK_APP_REPO!,
    title,
    body: `User ID: ${userId}\n\n${body}`,
    labels: [`user:${userId}`],
  });
  //
  res.json({
    url: issue.data.html_url,
    number: issue.data.number,
  });
}