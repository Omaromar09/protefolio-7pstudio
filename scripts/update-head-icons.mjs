import fs from 'fs';
import path from 'path';

const indexPath = path.resolve('index.html');
let html = fs.readFileSync(indexPath, 'utf8');

const oldBlockRegex = /<!-- Favicon & App Icons Set -->[\s\S]*?<meta name="theme-color" content="#07060C" \/>/;

const newBlock = `<!-- Favicon & App Icons Set (Google Search & Multi-Device Optimized) -->
    <link rel="icon" type="image/png" sizes="48x48" href="/favicon-48x48.png" />
    <link rel="icon" type="image/png" sizes="96x96" href="/favicon-96x96.png" />
    <link rel="icon" type="image/png" sizes="192x192" href="/favicon-192x192.png" />
    <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
    <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
    <link rel="shortcut icon" href="/favicon.ico" />
    <meta name="theme-color" content="#07060C" />`;

if (oldBlockRegex.test(html)) {
  html = html.replace(oldBlockRegex, newBlock);
  fs.writeFileSync(indexPath, html, 'utf8');
  console.log('Successfully updated favicon links in index.html');
} else {
  console.error('Could not find target favicon block in index.html');
  process.exit(1);
}
