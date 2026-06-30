const RESOURCE_WITH_LOCALE = new Set([
  "blog",
  "i18n",
  "tour",
  "tours",
  "transport",
  "transport-services",
  "example-tours",
  "story-elements",
  "intro-story",
  "translations",
]);

const readLocalJson = async (
  key: string,
  requestUrl?: string,
): Promise<unknown | null> => {
  try {
    // Data files in public/data/ are served as static assets at /data/{key}.json
    const origin = requestUrl ? new URL(requestUrl).origin : "";
    const url = `${origin}/data/${key}.json`;
    const response = await fetch(url);
    if (!response.ok) {
      return null;
    }
    return await response.json();
  } catch (err) {
    console.warn(
      "[Cloudflare Function] Failed to read local JSON for",
      key,
      err,
    );
    return null;
  }
};

const buildResourceKey = (resource: string, locale?: string) => {
  const normalized = resource.trim().toLowerCase();
  if (RESOURCE_WITH_LOCALE.has(normalized)) {
    const lang = locale?.trim().toLowerCase();
    if (!lang) {
      return null;
    }
    return `${normalized}-${lang}`;
  }
  return normalized;
};

const createErrorResponse = (message: string, status = 400) =>
  new Response(JSON.stringify({ error: message }), {
    status,
    headers: { "Content-Type": "application/json" },
  });

const loadStoredData = async (
  key: string,
  env: Record<string, any>,
  requestUrl?: string,
) => {
  // Use the DATA_KV_M binding
  const dataKV = env.DATA_KV_M;
  if (dataKV && typeof dataKV.get === "function") {
    try {
      const stored = await dataKV.get(key, { type: "json" });
      if (stored !== null) {
        return stored;
      }
    } catch (err) {
      console.warn("[Cloudflare Function] KV read failed for", key, err);
    }
  }

  // Fallback to local static JSON files in public/data/
  const localData = await readLocalJson(key, requestUrl);
  if (localData !== null) {
    return localData;
  }

  return null;
};

const saveStoredData = async (
  key: string,
  payload: unknown,
  env: Record<string, any>,
) => {
  // Use the DATA_KV_M binding
  const dataKV = env.DATA_KV_M;
  if (dataKV && typeof dataKV.put === "function") {
    try {
      await dataKV.put(key, JSON.stringify(payload));
      return;
    } catch (err) {
      console.warn("[Cloudflare Function] KV write failed for", key, err);
    }
  }
};

export async function onRequest(context: {
  request: Request;
  env: Record<string, any>;
}) {
  const { request, env } = context;
  const url = new URL(request.url);
  const resource = url.searchParams.get("resource");
  const locale = url.searchParams.get("locale");

  if (!resource) {
    return createErrorResponse("Missing resource query parameter.", 400);
  }

  const key = buildResourceKey(resource, locale || undefined);
  if (!key) {
    return createErrorResponse("Missing or invalid locale for resource.", 400);
  }

  try {
    if (request.method === "GET") {
      const data = await loadStoredData(key, env, request.url);
      if (data === null || data === undefined) {
        return createErrorResponse(
          `Data for resource '${resource}' not found.`,
          404,
        );
      }
      return new Response(JSON.stringify(data), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "public, max-age=60",
        },
      });
    }

    if (request.method === "PUT") {
      const adminPassword =
        env.ADMIN_PASSWORD || env.VITE_ADMIN_PASSWORD || "mariotours";
      const providedPassword = request.headers.get("X-Admin-Password") || "";
      if (providedPassword !== adminPassword) {
        return createErrorResponse(
          "Unauthorized: invalid admin password.",
          401,
        );
      }

      const body = await request.json().catch(() => null);
      if (body === null) {
        return createErrorResponse("Request body must be valid JSON.", 400);
      }
      await saveStoredData(key, body, env);
      return new Response(JSON.stringify(body), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    return createErrorResponse("Unsupported HTTP method.", 405);
  } catch (error: any) {
    return createErrorResponse(error?.message ?? "Internal error", 500);
  }
}
