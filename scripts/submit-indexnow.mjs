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

  const payload = {
    host: HOST,
    key: KEY,
    keyLocation: KEY_LOCATION,
    urlList: urls,
  };

  const endpoints = [
    'https://api.indexnow.org/indexnow',
    'https://www.bing.com/indexnow',
  ];

  for (const endpoint of endpoints) {
    try {
      console.log(`📡 Sending IndexNow payload to: ${endpoint}`);
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
        },
        body: JSON.stringify(payload),
      });

      if (response.ok || response.status === 200 || response.status === 202) {
        console.log(`✅ IndexNow submission to ${endpoint} SUCCESSFUL (HTTP ${response.status})`);
      } else {
        const text = await response.text();
        console.warn(`⚠️ IndexNow submission to ${endpoint} returned HTTP ${response.status}: ${text}`);
      }
    } catch (err) {
      console.error(`❌ Error submitting to ${endpoint}:`, err.message);
    }
  }

  console.log('🎉 IndexNow processing completed!');
}

main();
