import { fetchCurrentAdminPassword, getAdminPassword } from './authStore';

const rawBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim() || '';
const API_BASE_URL = rawBaseUrl.replace(/\/+$|^\s+|\s+$/g, '');
const DEFAULT_API_PATH = '/api/data';
const API_DATA_PATH = import.meta.env.VITE_DATA_API_ENDPOINT?.trim() || `${API_BASE_URL}${DEFAULT_API_PATH}`;

const buildQueryString = (params?: Record<string, string | number | boolean>) => {
  if (!params) return '';
  const query = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null) {
      query.set(key, String(value));
    }
  }
  const queryString = query.toString();
  return queryString ? `?${queryString}` : '';
};

const buildApiUrl = (resource: string, params?: Record<string, string | number | boolean>) => {
  const normalizedPath = API_DATA_PATH.replace(/\/+$/, '');
  const query = { resource, ...params };
  return `${normalizedPath}${buildQueryString(query)}`;
};

const parseJson = async <T>(response: Response): Promise<T> => {
  const body = await response.text();
  if (!body) {
    return {} as T;
  }
  try {
    return JSON.parse(body) as T;
  } catch (error) {
    throw new Error(`Failed to parse JSON response: ${error}`);
  }
};

const apiFetch = async <T>(resource: string, params?: Record<string, string | number | boolean>, options?: RequestInit): Promise<T> => {
  const url = buildApiUrl(resource, params);
  const response = await fetch(url, {
    ...options,
    headers: {
      Accept: 'application/json',
      'Content-Type': options?.body ? 'application/json' : undefined,
      ...(options?.headers ?? {}),
    },
    cache: options?.cache ?? 'no-cache',
  });

  if (!response.ok) {
    const message = `API request failed for ${resource} with status ${response.status}`;
    throw new Error(message);
  }

  return parseJson<T>(response);
};

export const apiGet = async <T>(resource: string, params?: Record<string, string | number | boolean>): Promise<T> =>
  apiFetch<T>(resource, params, { method: 'GET' });

export const apiPut = async <T>(resource: string, body: unknown, params?: Record<string, string | number | boolean>): Promise<T> => {
  const password = getAdminPassword() || await fetchCurrentAdminPassword();
  return apiFetch<T>(resource, params, {
    method: 'PUT',
    body: JSON.stringify(body),
    headers: password ? { 'X-Admin-Password': password } : undefined,
  });
};