import chalk from "chalk";
import { post as apiPost } from "../api.js";
import { parseDeadlineShorthand } from "../format.js";

interface PostResponse {
  id: string;
  message?: string;
}

export async function postBake(options: {
  title: string;
  desc: string;
  bounty: string;
  category: string;
  deadline: string;
}): Promise<void> {
  if (!options.title) throw new Error("--title is required");
  if (!options.desc) throw new Error("--desc is required");
  if (!options.bounty) throw new Error("--bounty is required");
  if (!options.category) throw new Error("--category is required");
  if (!options.deadline) throw new Error("--deadline is required");

  const bounty = parseInt(options.bounty, 10);
  if (isNaN(bounty) || bounty < 100) {
    throw new Error("Bounty must be a number >= 100 BP");
  }

  const validCategories = [
    "code",
    "research",
    "content",
    "data",
    "automation",
    "other",
  ];
  if (!validCategories.includes(options.category)) {
    throw new Error(
      `Category must be one of: ${validCategories.join(", ")}`
    );
  }

  const deadline = parseDeadlineShorthand(options.deadline);

  const body = {
    title: options.title,
    description: options.desc,
    bounty,
    category: options.category,
    deadline,
  };

  const res = await apiPost<PostResponse>("/bakes", body);
  console.log(chalk.green("Bake posted!"));
  console.log(`ID: ${res.id}`);
  if (res.message) {
    console.log(res.message);
  }
}
