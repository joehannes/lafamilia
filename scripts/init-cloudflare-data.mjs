const [, , rawUrl, rawSecret] = process.argv;
const initUrl = process.env.INIT_DATA_URL || rawUrl;
const initSecret = process.env.INIT_DATA_SECRET || rawSecret || process.env.VITE_INIT_DATA_SECRET;

if (!initUrl) {
  console.error('Missing Cloudflare init URL. Set INIT_DATA_URL or pass it as the first argument.');
  process.exit(1);
}

if (!initSecret) {
  console.error('Missing initialization secret. Set INIT_DATA_SECRET or VITE_INIT_DATA_SECRET or pass it as the second argument.');
  process.exit(1);
}

const run = async () => {
  const response = await fetch(initUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-init-secret': initSecret,
    },
  });

  const bodyText = await response.text();

  if (!response.ok) {
    console.error(`Initialization request failed with status ${response.status}`);
    console.error(bodyText);
    process.exit(1);
  }

  try {
    const bodyJson = JSON.parse(bodyText);
    console.log('Initialization complete. Result:');
    console.log(JSON.stringify(bodyJson, null, 2));
  } catch (err) {
    console.log('Initialization complete. Response:');
    console.log(bodyText);
  }
};

run().catch((error) => {
  console.error('Initialization script failed:', error);
  process.exit(1);
});
