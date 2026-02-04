import chalk from "chalk";
import { post } from "../api.js";

interface CancelResponse {
  message?: string;
}

export async function cancel(id: string): Promise<void> {
  const res = await post<CancelResponse>(`/bakes/${id}/cancel`);
  console.log(chalk.green("Bake cancelled."));
  if (res.message) {
    console.log(res.message);
  }
}
