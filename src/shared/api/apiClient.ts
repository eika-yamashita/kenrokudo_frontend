import { API_BASE } from '../../api/apiBase';

type Primitive = string | number | boolean | null;
type JsonValue = Primitive | JsonValue[] | { [key: string]: JsonValue };
type RequestBody = JsonValue | FormData | undefined;

type RequestOptions = {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  body?: RequestBody;
  signal?: AbortSignal;
};

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

const buildUrl = (path: string) => {
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }

  return `${API_BASE}${path.startsWith('/') ? path : `/${path}`}`;
};

const parseResponseText = async (response: Response) => {
  const text = await response.text();
  if (!text.trim()) {
    return null;
  }

  const contentType = response.headers.get('content-type') ?? '';
  if (contentType.includes('application/json')) {
    try {
      return JSON.parse(text);
    } catch {
      return text;
    }
  }

  return text;
};

const resolveErrorMessage = (payload: unknown, fallback: string) => {
  if (!payload) return fallback;
  if (typeof payload === 'string') return payload.trim() || fallback;
  if (typeof payload === 'object' && payload !== null && 'message' in payload) {
    const message = payload.message;
    if (typeof message === 'string' && message.trim()) {
      return message;
    }
  }

  return fallback;
};

async function request<T>(path: string, fallbackMessage: string, options: RequestOptions = {}): Promise<T> {
  const { body, method = 'GET', signal } = options;
  const isFormData = typeof FormData !== 'undefined' && body instanceof FormData;

  const response = await fetch(buildUrl(path), {
    method,
    signal,
    headers: isFormData || body === undefined ? undefined : { 'Content-Type': 'application/json' },
    body:
      body === undefined
        ? undefined
        : isFormData
          ? body
          : JSON.stringify(body),
  });

  const payload = await parseResponseText(response);

  if (!response.ok) {
    throw new ApiError(resolveErrorMessage(payload, fallbackMessage), response.status);
  }

  return payload as T;
}

export const apiClient = {
  get: <T>(path: string, fallbackMessage: string, signal?: AbortSignal) =>
    request<T>(path, fallbackMessage, { method: 'GET', signal }),
  post: <T>(path: string, body: RequestBody, fallbackMessage: string) =>
    request<T>(path, fallbackMessage, { method: 'POST', body }),
  put: <T>(path: string, body: RequestBody, fallbackMessage: string) =>
    request<T>(path, fallbackMessage, { method: 'PUT', body }),
  delete: <T>(path: string, fallbackMessage: string) =>
    request<T>(path, fallbackMessage, { method: 'DELETE' }),
};
