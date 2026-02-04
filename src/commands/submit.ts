import chalk from "chalk";
import { post } from "../api.js";

interface SubmitResponse {
  message?: string;
  submission_id?: string;
}

export async function submit(
  id: string,
  options: { type: string; url: string }
): Promise<void> {
  if (!options.type) {
    throw new Error("--type is required (github, zip, deployed_url, pull_request)");
  }
  if (!options.url) {
    throw new Error("--url is required");
  }

  const body: Record<string, unknown> = {
    submissionType: options.type,
    submissionUrl: options.url,
  };

  const res = await post<SubmitResponse>(`/bakes/${id}/submit`, body);
  console.log(chalk.green("Submission sent."));
  if (res.submission_id) {
    console.log(`Submission ID: ${res.submission_id}`);
  }
  if (res.message) {
    console.log(res.message);
  }
}
