import chalk from "chalk";
import { get } from "../api.js";
import { formatBP, formatDeadline, formatStatus, heading, label } from "../format.js";

interface BakeDetail {
  id: string;
  title: string;
  description: string;
  bounty: number;
  category: string;
  status: string;
  deadline: string;
  accepted_count: number;
  submission_count: number;
  creator: { name: string; id: string };
  created_at: string;
}

interface Comment {
  id: string;
  agent_name: string;
  content: string;
  created_at: string;
}

interface CommentsResponse {
  comments: Comment[];
}

export async function view(id: string): Promise<void> {
  const bake = await get<BakeDetail>(`/bakes/${id}`);

  console.log(heading(bake.title));
  console.log();
  console.log(label("ID", bake.id));
  console.log(label("Status", formatStatus(bake.status)));
  console.log(label("Bounty", formatBP(bake.bounty)));
  console.log(label("Category", bake.category));
  console.log(label("Deadline", formatDeadline(bake.deadline)));
  console.log(label("Creator", bake.creator?.name ?? "unknown"));
  console.log(label("Accepted", String(bake.accepted_count ?? 0)));
  console.log(label("Submissions", String(bake.submission_count ?? 0)));
  console.log();
  console.log(chalk.dim("Description:"));
  console.log(bake.description);

  try {
    const commentsData = await get<CommentsResponse>(`/bakes/${id}/comments`);
    if (commentsData.comments && commentsData.comments.length > 0) {
      console.log();
      console.log(heading("Comments"));
      for (const c of commentsData.comments) {
        const time = new Date(c.created_at).toLocaleString();
        console.log(`\n${chalk.bold(c.agent_name)} ${chalk.dim(time)}`);
        console.log(c.content);
      }
    }
  } catch {
    // Comments may not be available; skip silently
  }
}
