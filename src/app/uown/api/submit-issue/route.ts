/**
 * Set ENV here: https://vercel.com/vprojectz-dev/web-portal/settings/environments/production
 */
import { App } from "@octokit/app";
import { NextResponse } from "next/server";

///
export async function POST(req: Request) {
  // App key protection
  const appKey = req.headers.get("x-uown-app-key");
  if (appKey !== process.env.UOWN_APP_KEY) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401});
  }
  // Parse body
  const res: IssueRequest = await req.json();
  // Validate
  if (!res.title || res.title.length > 120) {
    return NextResponse.json({ error: "Invalid [title]" }, { status: 400 });
  }
  if (!res.userId || res.userId.length > 100) {
    return NextResponse.json({ error: "Invalid [userId]" }, { status: 400 });
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
  const issue = await octokit.request("POST /repos/{owner}/{repo}/issues", {
    owner: process.env.UOWN_GITHUB_FEEDBACK_APP_OWNER!,
    repo: process.env.UOWN_GITHUB_FEEDBACK_APP_REPO!,
    title: `[${res.issueType?.toUpperCase()}]: ${res.title}`,
    body: `
      ## 🧑 User Info
      - **User ID:** ${res.userId}
      - **Account Type:** ${res.accountType || "anonymous"}
      - **Device ID:** ${res.deviceId || "unknown"}
      ## 📱 App Info
      - **Platform:** ${res.platform || "unknown"}
      - **OS Version:** ${res.osVersion || "unknown"}
      - **App Version:** ${res.appVersion || "unknown"}
      - **Build Type:** ${res.buildType || "unknown"}
      - **Locale:** ${res.locale || "unknown"}
      - **Timezone:** ${res.timezone || "unknown"}
      ## 📝 Description
      ${res.body}
      ## 📷 Screenshots / Images
      ${(res.screenshotUrls ?? []).length > 0 ? (res.screenshotUrls ?? []).map(url => `![screenshot](${url})`).join("\n") : "No screenshots"}
    `.trim(),
    labels: [`user:${res.userId}`, `type:${res.issueType?.toLowerCase()}`],
  });
  // Return the whole issue object
  return NextResponse.json(issue.data);
}

///
type IssueRequest = {
  title: string;
  body: string;
  userId: string;
  issueType: "bug" | "feature" | "feedback";
  accountType: "anonymous" | "logged-in";
  deviceId?: string;
  platform?: string;       // iOS | Android | Web | Desktop
  osVersion?: string;      // iOS 17.2 | Android 14 | Windows 11
  appVersion?: string;     // v0.9.0+12
  buildType?: "release" | "debug";
  locale?: string;         // en-US
  timezone?: string;       // UTC-6
  screenshotUrls?: string[]; // array of screenshot URLs
};