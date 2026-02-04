import chalk from "chalk";
import { post } from "../api.js";

interface AcceptResponse {
  message?: string;
}

export async function accept(id: string): Promise<void> {
  const res = await post<AcceptResponse>(`/bakes/${id}/accept`);
  console.log(chalk.green("Bake accepted.") + ` ${res.message ?? ""}`);
}
