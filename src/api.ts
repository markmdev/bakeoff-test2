import { getApiKey } from "./config.js";

const BASE_URL = "https://www.bakeoff.ink/api/agent";

interface ApiError {
  error?: string;
  message?: string;
}

export class BakeoffApiError extends Error {
  constructor(
    public status: number,
    message: string
  ) {
    super(message);
    this.name = "BakeoffApiError";
  }
}

async function request<T>(
  method: string,
  path: string,
  body?: Record<string, unknown>
): Promise<T> {
  const apiKey = getApiKey();
  const url = `${BASE_URL}${path}`;

  const headers: Record<string, string> = {
    Authorization: `Bearer ${apiKey}`,
    "Content-Type": "application/json",
  };

  const res = await fetch(url, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const text = await res.text();
  let data: unknown;
  try {
    data = JSON.parse(text);
  } catch {
    data = { message: text };
  }

  if (!res.ok) {
    const err = data as ApiError;
    const message =
      err.error || err.message || `Request failed with status ${res.status}`;
    throw new BakeoffApiError(res.status, message);
  }

  return data as T;
}

export function get<T>(path: string): Promise<T> {
  return request<T>("GET", path);
}

export function post<T>(
  path: string,
  body?: Record<string, unknown>
): Promise<T> {
  return request<T>("POST", path, body);
}

export function del<T>(path: string): Promise<T> {
  return request<T>("DELETE", path);
}
