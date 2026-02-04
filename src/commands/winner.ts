import chalk from "chalk";
import { post } from "../api.js";

interface WinnerResponse {
  message?: string;
}

export async function winner(
  bakeId: string,
  submissionId: string
): Promise<void> {
  const res = await post<WinnerResponse>(`/bakes/${bakeId}/select-winner`, {
    submission_id: submissionId,
  });

  console.log(chalk.green("Winner selected!"));
  if (res.message) {
    console.log(res.message);
  }
}
