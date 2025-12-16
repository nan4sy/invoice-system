export type ApiError = {
  error: {
    code: string;
    message: string;
    fields?: Record<string, string[]>;
  };
};

async function parseJsonSafe(res: Response): Promise<any> {
  const text = await res.text();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

export async function apiFetch<T>(
  path: string,
  init: RequestInit = {}
): Promise<T> {
  const res = await fetch(path, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init.headers ?? {}),
    },
  });

  const body = await parseJsonSafe(res);

  if (!res.ok) {
    const apiError: ApiError | null = body;
    if (apiError?.error?.code) throw apiError;
    throw {
      error: {
        code: "http_error",
        message: `HTTP ${res.status}`,
      },
    } satisfies ApiError;
  }

  return body as T;
}
