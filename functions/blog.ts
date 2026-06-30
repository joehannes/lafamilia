/**
 * Blog Cloudflare Function
 *
 * Redirects to the unified /api/data endpoint so blog data goes through
 * the standard KV → local JSON → JSONBin fallback chain.
 *
 * Previously this function fetched directly from JSONBin, bypassing
 * the caching and fallback layers. Now it delegates to the shared API.
 *
 * Kept as a standalone function for backward-compatible URL support
 * (e.g. /blog?locale=en still works).
 */

export async function onRequest(context: { request: Request; env: Record<string, string> }) {
  const { request, env } = context;
  const url = new URL(request.url);
  const locale = url.searchParams.get('locale') || 'en';

  // Build the URL to the unified data API.
  const apiUrl = new URL(request.url);
  apiUrl.pathname = '/api/data';
  apiUrl.search = `?resource=blog&locale=${encodeURIComponent(locale)}`;

  // Forward the request to the unified API.
  const upstream = await fetch(apiUrl.toString(), {
    method: request.method,
    headers: request.headers,
    body: request.method !== 'GET' && request.method !== 'HEAD' ? request.body : null,
  });

  // Stream the response back to the client.
  return new Response(upstream.body, {
    status: upstream.status,
    statusText: upstream.statusText,
    headers: upstream.headers,
  });
}