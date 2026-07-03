const DEFAULT_ADMIN_PASSWORD = 'clavedulce';

/**
 * Simple in-memory auth store for the admin password.
 * Set after successful password authentication and used
 * by apiClient to attach the X-Admin-Password header to PUT requests.
 */
let adminPassword: string | null = null;

export const setAdminPassword = (password: string) => {
  adminPassword = password.trim() || DEFAULT_ADMIN_PASSWORD;
};

export const getAdminPassword = (): string | null => {
  return adminPassword;
};

export const clearAdminPassword = () => {
  adminPassword = null;
};

export const fetchCurrentAdminPassword = async (): Promise<string> => {
  try {
    const response = await fetch('/api/admin-password', {
      method: 'GET',
      headers: { Accept: 'application/json' },
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error(`Unable to load admin password (${response.status})`);
    }

    const data = await response.json() as { password?: string };
    return data.password?.trim() || import.meta.env.VITE_ADMIN_PASSWORD?.toString() || DEFAULT_ADMIN_PASSWORD;
  } catch (error) {
    console.warn('Failed to resolve current admin password from backend.', error);
    return import.meta.env.VITE_ADMIN_PASSWORD?.toString() || DEFAULT_ADMIN_PASSWORD;
  }
};

export const updateAdminPassword = async (password: string): Promise<string> => {
  const normalizedPassword = password.trim() || DEFAULT_ADMIN_PASSWORD;

  const response = await fetch('/api/admin-password', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password: normalizedPassword }),
  });

  if (!response.ok) {
    throw new Error('Failed to update the admin password.');
  }

  const data = await response.json() as { password?: string };
  const nextPassword = data.password?.trim() || normalizedPassword;
  setAdminPassword(nextPassword);
  return nextPassword;
};