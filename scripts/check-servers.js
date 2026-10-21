const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

const CONFIG_PATH = path.join(__dirname, '..', 'public', 'servers.json');

function checkUrl(url) {
  return new Promise((resolve) => {
    try {
      const parsed = new URL(url);
      const client = parsed.protocol === 'https:' ? https : http;
      const req = client.request(
        parsed,
        {
          method: 'GET',
          headers: {
            'User-Agent':
              'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          },
          timeout: 7000,
        },
        (res) => {
          // Status 200 to 399 is considered live/reachable
          if (res.statusCode >= 200 && res.statusCode < 400) {
            resolve({ ok: true, statusCode: res.statusCode });
          } else {
            resolve({ ok: false, statusCode: res.statusCode });
          }
        }
      );

      req.on('error', (err) => resolve({ ok: false, error: err.message }));
      req.on('timeout', () => {
        req.destroy();
        resolve({ ok: false, error: 'Timeout' });
      });
      req.end();
    } catch (e) {
      resolve({ ok: false, error: e.message });
    }
  });
}

async function runHealthCheck() {
  console.log('Starting automated streaming server health check...');
  if (!fs.existsSync(CONFIG_PATH)) {
    console.error('Config file not found:', CONFIG_PATH);
    process.exit(1);
  }

  const raw = fs.readFileSync(CONFIG_PATH, 'utf8');
  const registry = JSON.parse(raw);
  let changed = false;

  for (const server of registry.servers) {
    console.log(`\nChecking ${server.id} (${server.label})...`);
    console.log(`Current active domain: ${server.activeDomain}`);

    // Check movie sample endpoint or base domain
    const testEndpoint = server.moviePattern
      .replace('{domain}', server.activeDomain)
      .replace('{id}', 'tt1375666');

    const result = await checkUrl(testEndpoint);
    if (result.ok) {
      console.log(`[PASS] ${server.activeDomain} is healthy (${result.statusCode})`);
      continue;
    }

    console.warn(`[WARN] Active domain ${server.activeDomain} failed:`, result.statusCode || result.error);
    console.log(`Probing alternative mirrors for ${server.id}...`);

    let newWorkingDomain = null;
    for (const mirror of server.domains) {
      if (mirror === server.activeDomain) continue;
      const mirrorEndpoint = server.moviePattern
        .replace('{domain}', mirror)
        .replace('{id}', 'tt1375666');

      console.log(`  Probing ${mirror}...`);
      const mirrorResult = await checkUrl(mirrorEndpoint);
      if (mirrorResult.ok) {
        console.log(`  [FOUND WORKING MIRROR] ${mirror} (${mirrorResult.statusCode})`);
        newWorkingDomain = mirror;
        break;
      } else {
        console.log(`  [FAIL] ${mirror}:`, mirrorResult.statusCode || mirrorResult.error);
      }
    }

    if (newWorkingDomain) {
      console.log(`Updating ${server.id} activeDomain -> ${newWorkingDomain}`);
      server.activeDomain = newWorkingDomain;
      changed = true;
    } else {
      console.warn(`[ATTENTION] No healthy alternative mirrors responded for ${server.id}`);
    }
  }

  if (changed) {
    registry.updatedAt = new Date().toISOString();
    fs.writeFileSync(CONFIG_PATH, JSON.stringify(registry, null, 2) + '\n');
    console.log('\n[SUCCESS] public/servers.json has been automatically updated with new active domains.');
  } else {
    console.log('\nAll active server domains are currently operational. No updates required.');
  }
}

runHealthCheck();
