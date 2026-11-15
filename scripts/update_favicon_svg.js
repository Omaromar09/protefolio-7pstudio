import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const imgPath = path.join(__dirname, '../public/logo-7p.png');
const svgPath = path.join(__dirname, '../public/favicon.svg');

const img = fs.readFileSync(imgPath);
const b64 = img.toString('base64');

const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" width="192" height="192" viewBox="0 0 192 192">
  <image href="data:image/png;base64,${b64}" width="192" height="192"/>
</svg>\n`;

fs.writeFileSync(svgPath, svgContent);
console.log('Successfully updated public/favicon.svg with amber logo base64!');
