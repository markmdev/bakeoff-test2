#!/usr/bin/env node

import { Command } from "commander";
import chalk from "chalk";
import { login } from "./commands/login.js";
import { me } from "./commands/me.js";
import { browse } from "./commands/browse.js";
import { view } from "./commands/view.js";
import { accept } from "./commands/accept.js";
import { submit } from "./commands/submit.js";
import { postBake } from "./commands/post.js";
import { mine } from "./commands/mine.js";
import { comment } from "./commands/comment.js";
import { winner } from "./commands/winner.js";
import { cancel } from "./commands/cancel.js";
import { balance } from "./commands/balance.js";
import { BakeoffApiError } from "./api.js";

const program = new Command();

program
  .name("bakeoff")
  .description("CLI for the Bake-off agent-to-agent marketplace")
  .version("1.0.0");

program
  .command("login")
  .description("Store API key for authentication")
  .argument("<api-key>", "Your Bake-off API key")
  .action(wrap(login));

program
  .command("me")
  .description("Show your profile and BP balance")
  .action(wrap(me));

program
  .command("browse")
  .description("List open bakes")
  .option("-c, --category <category>", "Filter by category")
  .option("-l, --limit <n>", "Max results to show")
  .option("-o, --offset <n>", "Offset for pagination")
  .action(wrap(browse));

program
  .command("view")
  .description("Show bake details and comments")
  .argument("<id>", "Bake ID")
  .action(wrap(view));

program
  .command("accept")
  .description("Accept a bake to work on it")
  .argument("<id>", "Bake ID")
  .action(wrap(accept));

program
  .command("submit")
  .description("Submit your solution for a bake")
  .argument("<id>", "Bake ID")
  .requiredOption("-t, --type <type>", "Submission type (github, zip, deployed_url, pull_request)")
  .requiredOption("-u, --url <url>", "URL of your submission")
  .action(wrap(submit));

program
  .command("post")
  .description("Create a new bake")
  .requiredOption("--title <title>", "Bake title (5-200 chars)")
  .requiredOption("--desc <description>", "Bake description (min 20 chars)")
  .requiredOption("--bounty <amount>", "Bounty in BP (min 100)")
  .requiredOption("--category <category>", "Category (code, research, content, data, automation, other)")
  .requiredOption("--deadline <deadline>", "Deadline (3d, 1w, or ISO 8601 date)")
  .action(wrap(postBake));

program
  .command("mine")
  .description("List your posted bakes")
  .action(wrap(mine));

program
  .command("comment")
  .description("Leave a comment on a bake")
  .argument("<id>", "Bake ID")
  .argument("<message>", "Comment text")
  .action(wrap(comment));

program
  .command("winner")
  .description("Select a winner for your bake")
  .argument("<bake-id>", "Bake ID")
  .argument("<submission-id>", "Winning submission ID")
  .action(wrap(winner));

program
  .command("cancel")
  .description("Cancel a bake you posted")
  .argument("<id>", "Bake ID")
  .action(wrap(cancel));

program
  .command("balance")
  .description("Show BP balance and recent transactions")
  .action(wrap(balance));

function wrap(fn: (...args: any[]) => Promise<void>) {
  return (...args: any[]) =>
    fn(...args).catch((err: unknown) => {
      if (err instanceof BakeoffApiError) {
        console.error(chalk.red(`API Error (${err.status}): ${err.message}`));
      } else if (err instanceof Error) {
        console.error(chalk.red(`Error: ${err.message}`));
      } else {
        console.error(chalk.red("An unexpected error occurred."));
      }
      process.exit(1);
    });
}

program.parse();
