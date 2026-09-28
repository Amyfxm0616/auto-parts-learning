import { mockHttpRequest } from './mock-server';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export interface HttpRequestOptions {
  query?: Record<string, unknown>;
  body?: unknown;
  headers?: Record<string, string>;
  signal?: AbortSignal;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '';
const USE_MOCK_API = import.meta.env.VITE_USE_MOCK_API !== 'false';

function buildQueryString(query?: Record<string, unknown>) {
  if (!query) return '';

  const search = new URLSearchParams();

  Object.entries(query).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') return;

    if (Array.isArray(value)) {
      value.forEach((item) => {
        if (item !== undefined && item !== null && item !== '') {
          search.append(key, String(item));
        }
      });
      return;
    }

    search.set(key, String(value));
  });

  const qs = search.toString();
  return qs ? `?${qs}` : '';
}

async function parseJsonSafe(response: Response) {
  const contentType = response.headers.get('content-type') ?? '';
  if (!contentType.includes('application/json')) return null;
  return response.json();
}

async function request<T>(
  method: HttpMethod,
  path: string,
  options: HttpRequestOptions = {}
): Promise<T> {
  if (USE_MOCK_API) {
    return mockHttpRequest<T>({
      method,
      path,
      query: options.query,
      body: options.body,
    });
  }

  const url = `${API_BASE_URL}${path}${buildQueryString(options.query)}`;

  const response = await fetch(url, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers ?? {}),
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
    signal: options.signal,
  });

  if (!response.ok) {
    const errorBody = await parseJsonSafe(response);
    const message =
      errorBody?.message ||
      errorBody?.error ||
      `HTTP ${response.status} ${response.statusText}`;
    throw new Error(message);
  }

  const data = await parseJsonSafe(response);
  return data as T;
}

export const http = {
  get<T>(path: string, options?: Omit<HttpRequestOptions, 'body'>) {
    return request<T>('GET', path, options);
  },

  post<T>(path: string, options?: HttpRequestOptions) {
    return request<T>('POST', path, options);
  },

  put<T>(path: string, options?: HttpRequestOptions) {
    return request<T>('PUT', path, options);
  },

  patch<T>(path: string, options?: HttpRequestOptions) {
    return request<T>('PATCH', path, options);
  },

  delete<T>(path: string, options?: Omit<HttpRequestOptions, 'body'>) {
    return request<T>('DELETE', path, options);
  },
};
