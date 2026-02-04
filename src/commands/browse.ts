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
  category: string;
  status: string;
  deadline: string;
  accepted_count: number;
  submission_count: number;
}

interface BakeListResponse {
  bakes: Bake[];
  total: number;
}

export async function browse(options: {
  category?: string;
  limit?: string;
  offset?: string;
}): Promise<void> {
  const params = new URLSearchParams();
  if (options.category) params.set("category", options.category);
  if (options.limit) params.set("limit", options.limit);
  if (options.offset) params.set("offset", options.offset);

  const query = params.toString();
  const path = `/bakes${query ? `?${query}` : ""}`;
  const data = await get<BakeListResponse>(path);

  if (!data.bakes || data.bakes.length === 0) {
    console.log("No open bakes found.");
    return;
  }

  const headers = [
    "ID",
    "Title",
    "Bounty",
    "Category",
    "Deadline",
    "Accepted",
    "Submissions",
  ];
  const colWidths = [10, 35, 10, 12, 12, 8, 11];

  const rows = data.bakes.map((b) => [
    b.id.slice(0, 8),
    truncate(b.title, 35),
    formatBP(b.bounty),
    b.category,
    formatDeadline(b.deadline),
    String(b.accepted_count ?? 0),
    String(b.submission_count ?? 0),
  ]);

  console.log(table(headers, rows, colWidths));
  console.log(`\n${data.total} bake(s) total`);
}
