import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const HOST = 'www.sktradersphilipslighting.com';
const KEY = '4a8e91d84b9c49018e6922883e4401a4';
const KEY_LOCATION = `https://${HOST}/${KEY}.txt`;
const SITEMAP_PATH = path.join(__dirname, '../public/sitemap.xml');

async function main() {
  console.log('🚀 Starting IndexNow URL Submission to Bing & Search Engines...');

  if (!fs.existsSync(SITEMAP_PATH)) {
    console.error('❌ Sitemap file not found at:', SITEMAP_PATH);
    process.exit(1);
  }

  const xmlContent = fs.readFileSync(SITEMAP_PATH, 'utf-8');
  const locRegex = /<loc>(https?:\/\/[^<]+)<\/loc>/g;
  const urls = [];
  let match;

  while ((match = locRegex.exec(xmlContent)) !== null) {
    urls.push(match[1]);
  }

  console.log(`📌 Found ${urls.length} URLs in sitemap.xml to submit:`);
  urls.forEach((url, i) => console.log(`   ${i + 1}. ${url}`));

  // 1. Batch POST Submission
  const payload = {
    host: HOST,
    key: KEY,
    keyLocation: KEY_LOCATION,
    urlList: urls,
  };

  const endpoints = [
    'https://api.indexnow.org/indexnow',
    'https://www.bing.com/indexnow',
    'https://yandex.com/indexnow',
  ];

  for (const endpoint of endpoints) {
    try {
      console.log(`📡 Sending IndexNow POST payload to: ${endpoint}`);
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
        },
        body: JSON.stringify(payload),
      });

      const text = await response.text();
      if (response.ok || response.status === 200 || response.status === 202) {
        console.log(`✅ IndexNow POST to ${endpoint} SUCCESSFUL (HTTP ${response.status}): ${text || 'Accepted'}`);
      } else {
        console.warn(`⚠️ IndexNow POST to ${endpoint} returned HTTP ${response.status}: ${text}`);
      }
    } catch (err) {
      console.error(`❌ Error submitting POST to ${endpoint}:`, err.message);
    }
  }

  // 2. Individual GET Pings to Bing
  console.log('📡 Sending GET ping requests to Bing for key verification...');
  for (const url of urls) {
    try {
      const getUrl = `https://www.bing.com/indexnow?url=${encodeURIComponent(url)}&key=${KEY}&keyLocation=${encodeURIComponent(KEY_LOCATION)}`;
      const res = await fetch(getUrl);
      const resText = await res.text();
      if (res.ok || res.status === 200 || res.status === 202) {
        console.log(`  ✅ GET Ping [${url}] -> HTTP ${res.status}`);
      } else {
        console.warn(`  ⚠️ GET Ping [${url}] -> HTTP ${res.status}: ${resText}`);
      }
    } catch (e) {
      console.error(`  ❌ GET Ping error for [${url}]:`, e.message);
    }
  }

  console.log('🎉 IndexNow processing completed!');
}

main();
