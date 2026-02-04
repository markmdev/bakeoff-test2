import chalk from "chalk";
import { get } from "../api.js";
import { formatBP, heading, table } from "../format.js";

interface Transaction {
  id: string;
  type: string;
  amount: number;
  description: string;
  created_at: string;
}

interface TransactionsResponse {
  transactions: Transaction[];
  balance: number;
}

export async function balance(): Promise<void> {
  const data = await get<TransactionsResponse>("/transactions");

  console.log(heading("Balance"));
  console.log(formatBP(data.balance));

  if (data.transactions && data.transactions.length > 0) {
    console.log();
    console.log(heading("Recent Transactions"));

    const headers = ["Date", "Type", "Amount", "Description"];
    const colWidths = [12, 12, 10, 40];

    const rows = data.transactions.slice(0, 10).map((t) => [
      new Date(t.created_at).toLocaleDateString(),
      t.type,
      t.amount > 0 ? chalk.green(`+${t.amount}`) : chalk.red(String(t.amount)),
      t.description,
    ]);

    console.log(table(headers, rows, colWidths));
  }
}
