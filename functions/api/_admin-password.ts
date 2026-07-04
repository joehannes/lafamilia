const ADMIN_PASSWORD_KV_KEYS = ["ADMIN_PASSWORD", "ADMIN_PW"];
export const DEFAULT_ADMIN_PASSWORD = "clavedulce";

const readPasswordFromKv = async (
  dataKV: {
    get?: (key: string, options?: { type?: string }) => Promise<unknown>;
  },
  key: string,
): Promise<string | null> => {
  if (!dataKV || typeof dataKV.get !== "function") {
    return null;
  }

  try {
    const storedPassword = await dataKV.get(key, { type: "text" });
    if (typeof storedPassword === "string" && storedPassword.trim()) {
      return storedPassword.trim();
    }
  } catch (error) {
    console.warn(
      `[Cloudflare Function] Failed to read admin password from KV key ${key}`,
      error,
    );
  }

  return null;
};

export const getStoredAdminPassword = async (
  env: Record<string, any>,
): Promise<string> => {
  const dataKV = env.DATA_KV_M;

  for (const key of ADMIN_PASSWORD_KV_KEYS) {
    const storedPassword = await readPasswordFromKv(dataKV, key);
    if (storedPassword) {
      return storedPassword;
    }
  }

  const configuredPassword = [env.ADMIN_PASSWORD, env.VITE_ADMIN_PASSWORD].find(
    (value) => typeof value === "string" && value.trim(),
  );

  if (typeof configuredPassword === "string" && configuredPassword.trim()) {
    return configuredPassword.trim();
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
      await Promise.all(
        ADMIN_PASSWORD_KV_KEYS.map((key) =>
          dataKV.put(key, normalizedPassword),
        ),
      );
    } catch (error) {
      console.warn(
        "[Cloudflare Function] Failed to write admin password to KV",
        error,
      );
    }
  }

  return normalizedPassword;
};
