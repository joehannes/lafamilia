// Cloudflare Pages Function to initialize KV data from static JSON files
// This runs in the Cloudflare Workers runtime, not Node.js

const RESOURCE_ENTRIES = [
  { resource: "brand", filename: "brand.json" },
  { resource: "transfer-config", filename: "transfer-config.json" },
  { resource: "social-media", filename: "social-media.json" },
  { resource: "testimonials", filename: "testimonials.json" },
  {
    resource: "blog",
    locales: ["en", "es"],
    filenameTemplate: (locale) => `blog-${locale}.json`,
  },
  {
    resource: "tours",
    locales: ["en", "es"],
    filenameTemplate: (locale) => `tours-${locale}.json`,
  },
  {
    resource: "transport-services",
    locales: ["en", "es"],
    filenameTemplate: (locale) => `transport-services-${locale}.json`,
  },
  {
    resource: "example-tours",
    locales: ["en", "es"],
    filenameTemplate: (locale) => `example-tours-${locale}.json`,
  },
  {
    resource: "story-elements",
    locales: ["en", "es"],
    filenameTemplate: (locale) => `story-elements-${locale}.json`,
  },
  {
    resource: "intro-story",
    locales: ["en", "es"],
    filenameTemplate: (locale) => `intro-story-${locale}.json`,
  },
  {
    resource: "translations",
    locales: ["en", "es"],
    filenameTemplate: (locale) => `translations-${locale}.json`,
  },
];

const createErrorResponse = (message, status = 400) =>
  new Response(JSON.stringify({ error: message }), {
    status,
    headers: { "Content-Type": "application/json" },
  });

const fetchLocalJson = async (filename, requestUrl) => {
  try {
    // Data files in public/data/ are served as static assets at /data/{filename}
    const origin = requestUrl ? new URL(requestUrl).origin : "";
    const url = `${origin}/data/${filename}`;
    const response = await fetch(url);
    if (!response.ok) {
      return null;
    }
    return await response.json();
  } catch (err) {
    console.warn("[Cloudflare Function] Failed to fetch local JSON for", filename, err);
    return null;
  }
};

const saveToKV = async (env, key, payload) => {
  const dataKV = env.DATA_KV_M;
  if (!dataKV || typeof dataKV.put !== "function") {
    throw new Error(
      "DATA_KV_M namespace binding is not configured. Please bind a Cloudflare KV namespace to DATA_KV_M.",
    );
  }
  await dataKV.put(key, JSON.stringify(payload));
};

export async function onRequest(context: {
  request: Request;
  env: Record<string, any>;
}) {
  const { request, env } = context;
  const secretHeader = request.headers.get("x-init-secret") || "";
  const expectedSecret = env.INIT_DATA_SECRET;

  if (request.method !== "POST") {
    return createErrorResponse("Only POST requests are allowed.", 405);
  }

  if (!expectedSecret) {
    return createErrorResponse(
      "INIT_DATA_SECRET is not configured in Cloudflare environment.",
      500,
    );
  }

  if (secretHeader !== expectedSecret) {
    return createErrorResponse("Invalid initialization secret.", 401);
  }

  const dataKV = env.DATA_KV_M;
  if (!dataKV || typeof dataKV.put !== "function") {
    return createErrorResponse(
      "DATA_KV_M namespace binding is not configured. This initializer requires a Cloudflare KV namespace bound to DATA_KV_M.",
      500,
    );
  }

  const results: Array<{ key: string; status: string; message?: string }> = [];

  for (const entry of RESOURCE_ENTRIES) {
    try {
      if (entry.filename) {
        const payload = await fetchLocalJson(entry.filename, request.url);
        if (payload === null) {
          throw new Error(`Failed to fetch ${entry.filename}`);
        }
        await saveToKV(env, entry.resource, payload);
        results.push({ key: entry.resource, status: "stored" });
        continue;
      }

      for (const locale of entry.locales!) {
        const filename = entry.filenameTemplate!(locale);
        const resourceKey = `${entry.resource}-${locale}`;
        const payload = await fetchLocalJson(filename, request.url);
        if (payload === null) {
          throw new Error(`Failed to fetch ${filename}`);
        }
        await saveToKV(env, resourceKey, payload);
        results.push({ key: resourceKey, status: "stored" });
      }
    } catch (error: any) {
      results.push({
        key: entry.filename || entry.resource,
        status: "error",
        message: String(error?.message || error),
      });
    }
  }

  return new Response(JSON.stringify({ success: true, results }, null, 2), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
