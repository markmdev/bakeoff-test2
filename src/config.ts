import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";

interface Config {
  apiKey?: string;
}

const CONFIG_DIR = join(homedir(), ".bakeoff");
const CONFIG_FILE = join(CONFIG_DIR, "config.json");

function ensureConfigDir(): void {
  if (!existsSync(CONFIG_DIR)) {
    mkdirSync(CONFIG_DIR, { recursive: true });
  }
}

export function loadConfig(): Config {
  if (!existsSync(CONFIG_FILE)) {
    return {};
  }
  const raw = readFileSync(CONFIG_FILE, "utf-8");
  return JSON.parse(raw) as Config;
}

export function saveConfig(config: Config): void {
  ensureConfigDir();
  writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2) + "\n");
}

export function getApiKey(): string {
  const config = loadConfig();
  if (!config.apiKey) {
    throw new Error(
      "Not logged in. Run `bakeoff login <api-key>` to authenticate."
    );
  }
  return config.apiKey;
}
