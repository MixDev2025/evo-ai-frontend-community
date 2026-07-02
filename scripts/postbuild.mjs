import { readFileSync, writeFileSync, readdirSync, existsSync } from 'fs';
import { resolve, join, extname, relative, dirname } from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';
import { createHash } from 'crypto';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');
const distDir = resolve(root, 'dist');

function resolveAppVersion() {
  if (process.env.APP_VERSION) return process.env.APP_VERSION;
  try {
    return execSync('git describe --tags --always --dirty', {
      stdio: ['ignore', 'pipe', 'ignore'],
    }).toString().trim();
  } catch {
    return 'dev';
  }
}

function hashFile(filePath) {
  const content = readFileSync(filePath);
  return createHash('md5').update(content).digest('hex').substring(0, 10);
}

function getFiles(dir) {
  const entries = readdirSync(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...getFiles(fullPath));
    } else {
      files.push(fullPath);
    }
  }
  return files;
}

const extensionWhitelist = new Set([
  '.js', '.css', '.html', '.svg', '.png', '.ico',
  '.woff2', '.woff', '.ttf', '.eot', '.json', '.webp',
  '.avif', '.gif', '.jpg', '.jpeg',
]);

const exclusionPatterns = [
  /precache-manifest\.json$/,
  /node_modules/,
];

function shouldInclude(filePath) {
  const ext = extname(filePath).toLowerCase();
  if (!extensionWhitelist.has(ext)) return false;
  const rel = relative(distDir, filePath);
  for (const pat of exclusionPatterns) {
    if (pat.test(rel)) return false;
  }
  return true;
}

// --- Generate precache manifest ---
const allFiles = getFiles(distDir);
const manifestFiles = allFiles.filter(shouldInclude);

// Only precache files under /assets/ and root-level files
const precacheEntries = manifestFiles
  .filter((fp) => {
    const rel = relative(distDir, fp).replace(/\\/g, '/');
    // Include assets/* and root files (like index.html, favicon.svg, etc.)
    return rel.startsWith('assets/') || !rel.includes('/');
  })
  .map((fp) => {
    const rel = relative(distDir, fp).replace(/\\/g, '/');
    return {
      url: `/${rel}`,
      revision: hashFile(fp),
    };
  });

writeFileSync(
  resolve(distDir, 'precache-manifest.json'),
  JSON.stringify(precacheEntries, null, 2),
);
console.log(`✓ Generated precache-manifest.json with ${precacheEntries.length} assets`);

// --- Inject version into sw.js ---
const swPath = resolve(distDir, 'sw.js');
if (existsSync(swPath)) {
  let swContent = readFileSync(swPath, 'utf-8');
  const version = resolveAppVersion();
  swContent = swContent.replace(
    'self.__BUILD_VERSION__ = undefined',
    `self.__BUILD_VERSION__ = '${version}'`,
  );
  // Also replace cache version with a unique one based on the manifest hash
  const manifestHash = createHash('md5')
    .update(JSON.stringify(precacheEntries))
    .digest('hex')
    .substring(0, 8);
  swContent = swContent.replace(
    'self.__CACHE_BUSTER__ = undefined',
    `self.__CACHE_BUSTER__ = '${manifestHash}'`,
  );
  writeFileSync(swPath, swContent);
  console.log(`✓ Injected version ${version} and cache buster ${manifestHash} into sw.js`);
} else {
  console.warn('⚠ sw.js not found in dist, skipping version injection');
}
