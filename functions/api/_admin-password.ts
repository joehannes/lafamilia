const ADMIN_PASSWORD_KV_KEY = "ADMIN_PW";
export const DEFAULT_ADMIN_PASSWORD = "clavedulce";

export const getStoredAdminPassword = async (
  env: Record<string, any>,
): Promise<string> => {
  const dataKV = env.DATA_KV_M;

  if (dataKV && typeof dataKV.get === "function") {
    try {
      const storedPassword = await dataKV.get(ADMIN_PASSWORD_KV_KEY, {
        type: "text",
      });
      if (typeof storedPassword === "string" && storedPassword.trim()) {
        return storedPassword.trim();
      }
    } catch (error) {
      console.warn(
        "[Cloudflare Function] Failed to read admin password from KV",
        error,
      );
    }
  }

  return DEFAULT_ADMIN_PASSWORD;
};

export const setStoredAdminPassword = async (
  env: Record<string, any>,
  password: string,
): Promise<string> => {
  const normalizedPassword = password.trim() || DEFAULT_ADMIN_PASSWORD;
  const dataKV = env.DATA_KV_M;

  if (dataKV && typeof dataKV.put === "function") {
    try {
      await dataKV.put(ADMIN_PASSWORD_KV_KEY, normalizedPassword);
    } catch (error) {
      console.warn(
        "[Cloudflare Function] Failed to write admin password to KV",
        error,
      );
    }
  }

  return normalizedPassword;
};
