const fs = require('fs');
const path = require('path');

const rootDir = process.cwd();
const distDir = path.join(rootDir, 'dist');
const assetsDir = path.join(distDir, 'assets');

if (!fs.existsSync(assetsDir)) {
  console.error('dist/assets not found. Run npm run build first.');
  process.exit(1);
}

const files = fs.readdirSync(assetsDir);
const cssFile = files.find(f => f.endsWith('.css'));
const jsFile = files.find(f => f.endsWith('.js'));

if (!cssFile || !jsFile) {
  console.error('Missing css or js file in dist/assets');
  process.exit(1);
}

const cssContent = fs.readFileSync(path.join(assetsDir, cssFile), 'utf8');
let jsContent = fs.readFileSync(path.join(assetsDir, jsFile), 'utf8');

const usedImagePaths = [
  'images/rural_bg.png',
  'images/splash_art_bottom.png',
  'images/splash_logo_clean.png',
  'images/splash_people.png',
  'images/service-icons/animal-care.png',
  'images/service-icons/carpenter.png',
  'images/service-icons/cleaning.png',
  'images/service-icons/cooking.png',
  'images/service-icons/electrician.png',
  'images/service-icons/farm-work.png',
  'images/service-icons/gardening.png',
  'images/service-icons/general-labour.png',
  'images/service-icons/masonry.png',
  'images/service-icons/mechanic.png',
  'images/service-icons/painter.png',
  'images/service-icons/plumber.png',
  'images/service-icons/tailor.png',
  'images/service-icons/transport.png',
  'images/services/clean/animal_care.jpg',
  'images/services/clean/carpenter.jpg',
  'images/services/clean/cleaning.jpg',
  'images/services/clean/cooking.jpg',
  'images/services/clean/electrician.jpg',
  'images/services/clean/farm_work.jpg',
  'images/services/clean/gardening.jpg',
  'images/services/clean/general_labour.jpg',
  'images/services/clean/mechanic.jpg',
  'images/services/clean/painter.jpg',
  'images/services/clean/plumber.jpg',
  'images/services/clean/tailor.jpg',
  'images/services/clean/transport.jpg',
  'images/services/most-searched/carpenter.png',
  'images/services/most-searched/cleaning.png',
  'images/services/most-searched/electrician.png',
  'images/services/most-searched/plumber.png',
  'images/workers/gopalan.jpg',
  'images/workers/parvathy.jpg',
  'images/workers/rajesh.jpg'
];

function getMimeType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  switch (ext) {
    case '.png': return 'image/png';
    case '.jpg':
    case '.jpeg': return 'image/jpeg';
    case '.svg': return 'image/svg+xml';
    case '.webp': return 'image/webp';
    case '.gif': return 'image/gif';
    default: return 'application/octet-stream';
  }
}

const assetMap = {};

for (const rel of usedImagePaths) {
  const fullPath = path.join(rootDir, 'public', rel);
  if (fs.existsSync(fullPath)) {
    const mime = getMimeType(fullPath);
    const b64 = fs.readFileSync(fullPath).toString('base64');
    assetMap[rel] = `data:${mime};base64,${b64}`;
  }
}

console.log(`Encoded ${Object.keys(assetMap).length} active images to Base64.`);

// Directly replace static paths in JS
let replacedCount = 0;
for (const [rel, dataUri] of Object.entries(assetMap)) {
  // matches "/images/..." or "./images/..." or "images/..."
  const regex = new RegExp(`(["'\`])(?:\\.?\\/)?${rel.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')}\\1`, 'g');
  if (regex.test(jsContent)) {
    jsContent = jsContent.replace(regex, `$1${dataUri}$1`);
    replacedCount++;
  }
}

console.log(`Directly replaced ${replacedCount} static image references in JS.`);

// Neutralize import.meta so the script can run as standard classic script (no file:// CORS limitations)
jsContent = jsContent.replace(/import\.meta\.resolve\?import\.meta\.resolve\(e\):new URL\(e,import\.meta\.url\)\.href/g, "e");
jsContent = jsContent.replace(/import\.meta\.url/g, "window.location.href");
jsContent = jsContent.replace(/import\.meta/g, "({})");

const imageResolverScript = `
  // Embedded Offline Asset Resolver & file:// polyfills
  window.__SEVA_SETU_ASSETS__ = ${JSON.stringify(assetMap)};
  
  (function() {
    // Ensure initial hash route on file protocol
    if (!window.location.hash || window.location.hash === '' || window.location.hash === '#') {
      window.location.hash = '#/';
    }

    function resolveUri(url) {
      if (!url || typeof url !== 'string') return url;
      if (url.startsWith('data:')) return url;
      const clean = url.replace(/^[a-zA-Z]+:\\/\\/[^\\/]+/, '').replace(/^\\.?\\//, '');
      return window.__SEVA_SETU_ASSETS__[clean] || url;
    }

    const originalSrcDescriptor = Object.getOwnPropertyDescriptor(HTMLImageElement.prototype, 'src');
    if (originalSrcDescriptor && originalSrcDescriptor.set) {
      Object.defineProperty(HTMLImageElement.prototype, 'src', {
        set: function(val) {
          return originalSrcDescriptor.set.call(this, resolveUri(val));
        },
        get: originalSrcDescriptor.get,
        configurable: true
      });
    }

    // Intercept setAttribute for src
    const origSetAttr = Element.prototype.setAttribute;
    Element.prototype.setAttribute = function(name, val) {
      if (name === 'src' && this.tagName === 'IMG') {
        return origSetAttr.call(this, name, resolveUri(val));
      }
      return origSetAttr.call(this, name, val);
    };
  })();
`;

const singleHtmlContent = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🌿</text></svg>" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover" />
    <title>Seva Setu — Local Service Marketplace</title>
    <meta name="description" content="Seva Setu is a local service marketplace connecting rural communities with skilled independent workers." />
    <style>
${cssContent}
    </style>
    <script>
      // Runtime diagnostic error capture (surfaces errors instead of blank screen)
      window.addEventListener('error', function(e) {
        console.error('App Launch Error:', e);
        var root = document.getElementById('root');
        if (root && root.children.length === 0) {
          var box = document.createElement('div');
          box.style.cssText = 'padding:18px;margin:20px;background:#FEF2F2;border:1.5px solid #F87171;border-radius:16px;color:#991B1B;font-family:sans-serif;font-size:13px;line-height:1.5;box-shadow:0 8px 24px rgba(0,0,0,0.12);';
          box.innerHTML = '<h3 style="margin:0 0 6px;font-size:15px;font-weight:700;">⚠️ Application Notice</h3><p style="margin:0 0 4px;">' + (e.message || 'Error initializing application') + '</p><pre style="margin:4px 0 0;font-size:11px;overflow:auto;max-height:160px;background:#fff;padding:8px;border-radius:8px;">' + (e.error && e.error.stack ? e.error.stack : '') + '</pre>';
          root.appendChild(box);
        }
      });
    </script>
  </head>
  <body>
    <div id="root"></div>
    <script>
${imageResolverScript}
    </script>
    <script>
${jsContent}
    </script>
  </body>
</html>
`;

const singleFilePath = path.join(rootDir, 'SevaSetu.html');
const singleFileBackupPath = path.join(rootDir, 'SevaSetu_SingleFile.html');

fs.writeFileSync(singleFilePath, singleHtmlContent, 'utf8');
fs.writeFileSync(singleFileBackupPath, singleHtmlContent, 'utf8');

const sizeMb = (Buffer.byteLength(singleHtmlContent, 'utf8') / (1024 * 1024)).toFixed(2);
console.log(`Generated self-contained single HTML file:`);
console.log(`- ${singleFilePath} (${sizeMb} MB)`);
console.log(`- ${singleFileBackupPath} (${sizeMb} MB)`);
