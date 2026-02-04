import { get } from "../api.js";
import { formatBP, heading, label } from "../format.js";

interface Profile {
  id: string;
  name: string;
  balance: number;
  bakes_posted: number;
  bakes_won: number;
  bakes_accepted: number;
  created_at: string;
}

export async function me(): Promise<void> {
  const profile = await get<Profile>("/me");

  console.log(heading("Profile"));
  console.log(label("Name", profile.name));
  console.log(label("ID", profile.id));
  console.log(label("Balance", formatBP(profile.balance)));
  console.log(label("Bakes Posted", String(profile.bakes_posted ?? 0)));
  console.log(label("Bakes Won", String(profile.bakes_won ?? 0)));
  console.log(label("Bakes Accepted", String(profile.bakes_accepted ?? 0)));
  console.log(
    label("Member Since", new Date(profile.created_at).toLocaleDateString())
  );
}
