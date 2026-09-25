const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const distDir = path.join(rootDir, 'dist');
const assetsDir = path.join(distDir, 'assets');
const outputDir = path.join(rootDir, 'standalone');

if (!fs.existsSync(assetsDir)) {
  console.error('dist/assets not found. Run npm run build first.');
  process.exit(1);
}

// Find CSS and JS files
const files = fs.readdirSync(assetsDir);
const cssFile = files.find(f => f.endsWith('.css'));
const jsFile = files.find(f => f.endsWith('.js'));

if (!cssFile || !jsFile) {
  console.error('Could not find CSS or JS in dist/assets');
  process.exit(1);
}

console.log(`Using CSS: ${cssFile}`);
console.log(`Using JS: ${jsFile}`);

const cssContent = fs.readFileSync(path.join(assetsDir, cssFile), 'utf8');
let jsContent = fs.readFileSync(path.join(assetsDir, jsFile), 'utf8');

// Replace root-relative image paths with relative paths for local file:// compatibility
jsContent = jsContent.replace(/["']\/images\//g, '"./images/');

// Create output directory
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Copy images and static assets to standalone/
const publicImagesDir = path.join(rootDir, 'public', 'images');
const outputImagesDir = path.join(outputDir, 'images');

function copyDirRecursive(src, dest) {
  if (!fs.existsSync(src)) return;
  if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDirRecursive(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

copyDirRecursive(publicImagesDir, outputImagesDir);
console.log('Copied images directory.');

// Copy favicon/icons if exist
['favicon.svg', 'icons.svg'].forEach(file => {
  const src = path.join(rootDir, 'public', file);
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, path.join(outputDir, file));
  }
});

// Construct the self-contained HTML
const htmlContent = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🌿</text></svg>" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover" />
    <title>Seva Setu — Local Service Marketplace (Standalone)</title>
    <meta name="description" content="Seva Setu is a local service marketplace connecting rural communities with skilled independent workers." />
    <style>
${cssContent}
    </style>
  </head>
  <body>
    <div id="root"></div>
    <script type="module">
${jsContent}
    </script>
  </body>
</html>
`;

fs.writeFileSync(path.join(outputDir, 'index.html'), htmlContent, 'utf8');
console.log(`Successfully generated standalone HTML at: ${path.join(outputDir, 'index.html')}`);

// Create README.md in standalone folder
const readmeContent = `# Seva Setu — Standalone Prototype

This folder contains a self-contained build of the Seva Setu web application.

## How to Run:
1. Simply double-click **\`index.html\`** or open it in any web browser (Google Chrome, Firefox, Safari, Edge, etc.).
2. No \`npm\`, \`Node.js\`, terminal commands, or internet servers are required.
3. The application works completely offline with all features, interactive modals, job creation, and worker selection intact.
`;

fs.writeFileSync(path.join(outputDir, 'README.md'), readmeContent, 'utf8');
console.log('Created standalone/README.md');

