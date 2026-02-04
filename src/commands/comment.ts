import chalk from "chalk";
import { post } from "../api.js";

interface CommentResponse {
  id?: string;
  message?: string;
}

export async function comment(id: string, message: string): Promise<void> {
  if (!message) {
    throw new Error("Comment message is required.");
  }

  const res = await post<CommentResponse>(`/bakes/${id}/comments`, {
    content: message,
  });

  console.log(chalk.green("Comment posted."));
  if (res.id) {
    console.log(`Comment ID: ${res.id}`);
  }
}
