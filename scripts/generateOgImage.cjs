const sharp = require('../node_modules/sharp');
const path = require('path');

async function createOgImage() {
  const width = 1200;
  const height = 630;

  // Render a clean, high-aesthetic SVG layout with Omar's visual identity:
  // Warm off-white #FBF8F4, soft peach blur, orange accent #E8552B, Geist / IBM Plex Sans Arabic styling
  const svgOverlay = `
  <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <radialGradient id="peach1" cx="20%" cy="15%" r="45%">
        <stop offset="0%" stop-color="#FEDAC4" stop-opacity="0.6"/>
        <stop offset="100%" stop-color="#FBF8F4" stop-opacity="0"/>
      </radialGradient>
      <radialGradient id="peach2" cx="80%" cy="85%" r="40%">
        <stop offset="0%" stop-color="#FFE1CD" stop-opacity="0.5"/>
        <stop offset="100%" stop-color="#FBF8F4" stop-opacity="0"/>
      </radialGradient>
      <filter id="shadow" x="-10%" y="-10%" width="125%" height="125%">
        <feDropShadow dx="0" dy="16" stdDeviation="24" flood-color="#14110F" flood-opacity="0.08"/>
      </filter>
      <clipPath id="cardClip">
        <rect x="760" y="75" width="360" height="480" rx="28" ry="28"/>
      </clipPath>
    </defs>

    <!-- Warm off-white background -->
    <rect width="${width}" height="${height}" fill="#FBF8F4"/>
    <rect width="${width}" height="${height}" fill="url(#peach1)"/>
    <rect width="${width}" height="${height}" fill="url(#peach2)"/>

    <!-- Left side typography -->
    <g transform="translate(100, 150)">
      <!-- Orange badge dot -->
      <rect x="0" y="0" width="168" height="38" rx="19" fill="#FFFFFF" filter="url(#shadow)"/>
      <circle cx="20" cy="19" r="6" fill="#E8552B"/>
      <text x="36" y="24" font-family="'IBM Plex Sans Arabic', 'Geist', sans-serif" font-size="14" font-weight="600" fill="#14110F">مصمم ومطور ويب</text>

      <!-- Main Headline -->
      <text x="0" y="115" font-family="'IBM Plex Sans Arabic', 'Geist', sans-serif" font-size="64" font-weight="800" fill="#14110F" letter-spacing="-1">عمر يحيى</text>
      <text x="0" y="180" font-family="'Geist', sans-serif" font-size="28" font-weight="600" fill="#8A817A">Omar Yahia — Personal Portfolio</text>

      <text x="0" y="250" font-family="'IBM Plex Sans Arabic', 'Geist', sans-serif" font-size="24" font-weight="500" fill="#14110F">بصمم وببرمج مواقع عصرية وتفاعلية</text>
      <text x="0" y="285" font-family="'Geist', sans-serif" font-size="18" font-weight="400" fill="#8A817A">Design, 3D &amp; Motion · Realtime Experience</text>

      <!-- Pill tag -->
      <g transform="translate(0, 330)">
        <rect x="0" y="0" width="220" height="44" rx="22" fill="#E8552B"/>
        <text x="110" y="27" font-family="'IBM Plex Sans Arabic', 'Geist', sans-serif" font-size="16" font-weight="600" fill="#FFFFFF" text-anchor="middle">قابل عمر · Meet Omar</text>
      </g>
    </g>

    <!-- Photo Card border & check badge -->
    <rect x="758" y="73" width="364" height="484" rx="30" ry="30" fill="none" stroke="#E8552B" stroke-width="3"/>
    
    <!-- Orange check badge -->
    <g transform="translate(1085, 90)">
      <circle cx="0" cy="0" r="18" fill="#E8552B"/>
      <path d="M-6 -1 L-2 4 L6 -5" fill="none" stroke="#FFFFFF" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
    </g>
  </svg>`;

  // Prepare photo-2 as the landing photo in the card
  const photo2Path = path.join(__dirname, '../public/photos/photo-2.webp');
  const photoBuffer = await sharp(photo2Path)
    .resize(360, 480, { fit: 'cover', position: 'top' })
    .toBuffer();

  // Create rounded mask for photo
  const roundedCorners = Buffer.from(
    `<svg width="360" height="480"><rect x="0" y="0" width="360" height="480" rx="28" ry="28"/></svg>`
  );
  const roundedPhoto = await sharp(photoBuffer)
    .composite([{ input: roundedCorners, blend: 'dest-in' }])
    .png()
    .toBuffer();

  const svgBuffer = Buffer.from(svgOverlay);

  await sharp(svgBuffer)
    .composite([
      { input: roundedPhoto, top: 75, left: 760 }
    ])
    .jpeg({ quality: 92 })
    .toFile(path.join(__dirname, '../public/og-image.jpg'));

  console.log('og-image.jpg created successfully (1200x630)');
}

createOgImage().catch(console.error);
