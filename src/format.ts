import chalk from "chalk";

export function formatBP(amount: number): string {
  return chalk.yellow(`${amount} BP`);
}

export function formatDeadline(iso: string): string {
  const deadline = new Date(iso);
  const now = new Date();
  const diffMs = deadline.getTime() - now.getTime();

  if (diffMs < 0) {
    return chalk.red("expired");
  }

  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffHours / 24);

  if (diffDays > 0) {
    return chalk.green(`${diffDays}d left`);
  }
  if (diffHours > 0) {
    return chalk.yellow(`${diffHours}h left`);
  }
  const diffMins = Math.floor(diffMs / (1000 * 60));
  return chalk.yellow(`${diffMins}m left`);
}

export function formatStatus(status: string): string {
  switch (status) {
    case "open":
      return chalk.green("open");
    case "in_progress":
      return chalk.blue("in progress");
    case "completed":
      return chalk.cyan("completed");
    case "cancelled":
      return chalk.gray("cancelled");
    case "expired":
      return chalk.red("expired");
    default:
      return status;
  }
}

export function truncate(str: string, maxLen: number): string {
  if (str.length <= maxLen) return str;
  return str.slice(0, maxLen - 1) + "…";
}

export function table(
  headers: string[],
  rows: string[][],
  colWidths?: number[]
): string {
  const widths =
    colWidths ??
    headers.map((h, i) =>
      Math.max(h.length, ...rows.map((r) => stripAnsi(r[i] ?? "").length))
    );

  const headerLine = headers
    .map((h, i) => chalk.bold(h.padEnd(widths[i])))
    .join("  ");
  const separator = widths.map((w) => "─".repeat(w)).join("──");
  const body = rows
    .map((row) =>
      row.map((cell, i) => padWithAnsi(cell, widths[i])).join("  ")
    )
    .join("\n");

  return `${headerLine}\n${separator}\n${body}`;
}

function stripAnsi(str: string): string {
  // eslint-disable-next-line no-control-regex
  return str.replace(/\x1b\[[0-9;]*m/g, "");
}

function padWithAnsi(str: string, width: number): string {
  const visible = stripAnsi(str).length;
  if (visible >= width) return str;
  return str + " ".repeat(width - visible);
}

export function parseDeadlineShorthand(input: string): string {
  const match = input.match(/^(\d+)([dhw])$/);
  if (!match) {
    // Assume it's already an ISO date
    const d = new Date(input);
    if (isNaN(d.getTime())) {
      throw new Error(
        `Invalid deadline: "${input}". Use shorthand (3d, 1w) or an ISO 8601 date.`
      );
    }
    return d.toISOString();
  }

  const amount = parseInt(match[1], 10);
  const unit = match[2];
  const now = new Date();

  switch (unit) {
    case "h":
      now.setHours(now.getHours() + amount);
      break;
    case "d":
      now.setDate(now.getDate() + amount);
      break;
    case "w":
      now.setDate(now.getDate() + amount * 7);
      break;
  }

  return now.toISOString();
}

export function heading(text: string): string {
  return chalk.bold.underline(text);
}

export function label(key: string, value: string): string {
  return `${chalk.dim(key + ":")} ${value}`;
}

export function errorMessage(msg: string): string {
  return chalk.red(`Error: ${msg}`);
}
