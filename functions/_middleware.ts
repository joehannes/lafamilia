// Middleware removed: no more domain redirect.
// Canonical URL is set in index.html as a SEO hint only.
export async function onRequest(context: {
  request: Request;
  next: () => Promise<Response>;
}) {
  return context.next();
}
