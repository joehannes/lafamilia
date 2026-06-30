/**
 * Simple in-memory auth store for the admin password.
 * Set after successful password authentication and used
 * by apiClient to attach the X-Admin-Password header to PUT requests.
 */
let adminPassword: string | null = null;

export const setAdminPassword = (password: string) => {
  adminPassword = password;
};

export const getAdminPassword = (): string | null => {
  return adminPassword;
};

export const clearAdminPassword = () => {
  adminPassword = null;
};