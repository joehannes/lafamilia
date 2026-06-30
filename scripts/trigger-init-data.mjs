/**
 * trigger-init-data.mjs
 *
 * Post-deploy script that triggers the /api/init-data endpoint on a
 * LIVE Cloudflare Pages deployment to populate KV storage.
 *
 * This is NOT part of the build pipeline anymore — it runs manually after
 * first deploy, or whenever you want to re-populate KV from JSONBin.
 *
 * Usage:
 *   INIT_DATA_URL=https://your-site.pages.dev/api/init-data \
 *   INIT_DATA_SECRET=your-secret \
 *   node scripts/trigger-init-data.mjs
 *
 * Or with positional arguments:
 *   node scripts/trigger-init-data.mjs https://your-site.pages.dev/api/init-data your-secret
 */

const [, , rawUrl, rawSecret] = process.argv;
const url = process.env.INIT_DATA_URL || rawUrl;
const secret = process.env.INIT_DATA_SECRET || rawSecret;

const MAX_ATTEMPTS = 10;
const RETRY_DELAY_MS = 5000;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const log = (message) => console.log(`[trigger-init-data] ${message}`);

if (!url) {
  log('No INIT_DATA_URL configured. Skipping init trigger.');
  log('Usage: INIT_DATA_URL=https://your-site.pages.dev/api/init-data INIT_DATA_SECRET=your-secret node scripts/trigger-init-data.mjs');
  process.exit(0);
}

if (!secret) {
  log('No INIT_DATA_SECRET configured. Skipping init trigger.');
  process.exit(0);
}

const attemptInit = async () => {
  try {
    log(`Calling ${url} …`);
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-init-secret': secret,
      },
    });

    const text = await response.text();
    if (response.ok) {
      log(`Initialization succeeded on ${url}`);
      try {
        log(JSON.stringify(JSON.parse(text), null, 2));
      } catch {
        log(text);
      }
      return true;
    }

    log(`Initialization request returned status ${response.status}. Response: ${text}`);
    return false;
  } catch (error) {
    log(`Initialization request failed: ${error.message || error}`);
    return false;
  }
};

const run = async () => {
  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt += 1) {
    log(`Attempt ${attempt}/${MAX_ATTEMPTS} to trigger init endpoint.`);
    const success = await attemptInit();
    if (success) {
      return;
    }
    if (attempt < MAX_ATTEMPTS) {
      log(`Waiting ${RETRY_DELAY_MS / 1000}s before retrying…`);
      await sleep(RETRY_DELAY_MS);
    }
  }

  log('Initialization endpoint did not become reachable after retries.');
  log('Make sure your site is deployed and live at the URL you provided.');
  process.exit(1);
};

run();