import chalk from "chalk";
import { saveConfig } from "../config.js";

export async function login(apiKey: string): Promise<void> {
  saveConfig({ apiKey });
  console.log(chalk.green("API key saved.") + " You're logged in.");
}
