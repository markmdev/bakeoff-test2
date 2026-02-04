import { get } from "../api.js";
import {
  formatBP,
  formatDeadline,
  formatStatus,
  table,
  truncate,
} from "../format.js";

interface Bake {
  id: string;
  title: string;
  bounty: number;
  status: string;
  deadline: string;
  submission_count: number;
}

interface BakeListResponse {
  bakes: Bake[];
  total: number;
}

export async function mine(): Promise<void> {
  const data = await get<BakeListResponse>("/bakes?mine=true");

  if (!data.bakes || data.bakes.length === 0) {
    console.log("You haven't posted any bakes yet.");
    return;
  }

  const headers = ["ID", "Title", "Bounty", "Status", "Deadline", "Submissions"];
  const colWidths = [10, 35, 10, 12, 12, 11];

  const rows = data.bakes.map((b) => [
    b.id.slice(0, 8),
    truncate(b.title, 35),
    formatBP(b.bounty),
    formatStatus(b.status),
    formatDeadline(b.deadline),
    String(b.submission_count ?? 0),
  ]);

  console.log(table(headers, rows, colWidths));
  console.log(`\n${data.total} bake(s) total`);
}
