import {
  DEFAULT_ADMIN_PASSWORD,
  getStoredAdminPassword,
  setStoredAdminPassword,
} from "./_admin-password";

const createJsonResponse = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });

export async function onRequest(context: {
  request: Request;
  env: Record<string, any>;
}) {
  const { request, env } = context;

  if (request.method === "GET") {
    const password = await getStoredAdminPassword(env);
    return createJsonResponse({ password });
  }

  if (request.method === "PUT") {
    try {
      const body = (await request.json().catch(() => null)) as {
        password?: string;
      } | null;
      const nextPassword = await setStoredAdminPassword(
        env,
        body?.password || DEFAULT_ADMIN_PASSWORD,
      );
      return createJsonResponse({ password: nextPassword }, 200);
    } catch (error: any) {
      return createJsonResponse(
        { error: error?.message ?? "Unable to update admin password." },
        500,
      );
    }
  }

  return createJsonResponse({ error: "Method not allowed" }, 405);
}
