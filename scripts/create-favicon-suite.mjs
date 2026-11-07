import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

async function generate() {
  console.log('Extracting and trimming 7P master logo...');
  const trimmedLogoBuffer = await sharp('public/logo-7p.png')
    .trim({ threshold: 10 })
    .toBuffer();

  const trimmedMeta = await sharp(trimmedLogoBuffer).metadata();
  console.log(`Trimmed logo: ${trimmedMeta.width}x${trimmedMeta.height}`);

  // Safe area sizing:
  // For a 512x512 canvas, diameter is 512.
  // The emblem should be ~330px wide so it has ~90px padding all around.
  // In a circle mask (radius 256), the emblem sits entirely inside with ample safety margin!
  const targetWidth = 330;
  const targetHeight = Math.round(targetWidth * (trimmedMeta.height / trimmedMeta.width));

  const resizedEmblem = await sharp(trimmedLogoBuffer)
    .resize(targetWidth, targetHeight, { fit: 'contain' })
    .toBuffer();

  const emblemMeta = await sharp(resizedEmblem).metadata();
  const left = Math.round((512 - emblemMeta.width) / 2);
  const top = Math.round((512 - emblemMeta.height) / 2);

  // Background: Sleek Dark Circle with subtle brand gradient border
  const darkCircleSvg = Buffer.from(`
    <svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="bg" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#141122"/>
          <stop offset="70%" stop-color="#080711"/>
          <stop offset="100%" stop-color="#05040A"/>
        </radialGradient>
        <linearGradient id="borderGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#FF3DF0" stop-opacity="0.8"/>
          <stop offset="50%" stop-color="#8B3DFF" stop-opacity="0.4"/>
          <stop offset="100%" stop-color="#00F0FF" stop-opacity="0.8"/>
        </linearGradient>
      </defs>
      <circle cx="256" cy="256" r="252" fill="url(#bg)" stroke="url(#borderGrad)" stroke-width="6"/>
    </svg>
  `);

  // Master 512x512 with dark circle
  const masterDarkCircle = await sharp(darkCircleSvg)
    .composite([{ input: resizedEmblem, left, top }])
    .png()
    .toBuffer();

  // Save 512x512 master
  await sharp(masterDarkCircle).toFile('public/favicon-512x512.png');
  console.log('Created public/favicon-512x512.png');

  // Generate Google-specific multiples of 48px:
  // 192x192 (4x)
  await sharp(masterDarkCircle).resize(192, 192).toFile('public/favicon-192x192.png');
  console.log('Created public/favicon-192x192.png');

  // 96x96 (2x)
  await sharp(masterDarkCircle).resize(96, 96).toFile('public/favicon-96x96.png');
  console.log('Created public/favicon-96x96.png');

  // 48x48 (1x - Google Search Primary Recommended Dimension)
  await sharp(masterDarkCircle).resize(48, 48).toFile('public/favicon-48x48.png');
  console.log('Created public/favicon-48x48.png');

  // 180x180 (Apple Touch Icon)
  await sharp(masterDarkCircle).resize(180, 180).toFile('public/apple-touch-icon.png');
  console.log('Updated public/apple-touch-icon.png');

  // 32x32 (Browser tab)
  await sharp(masterDarkCircle).resize(32, 32).toFile('public/favicon-32x32.png');
  console.log('Updated public/favicon-32x32.png');

  // 16x16 (Small tab)
  await sharp(masterDarkCircle).resize(16, 16).toFile('public/favicon-16x16.png');
  console.log('Updated public/favicon-16x16.png');

  // Copy 48x48 as favicon.ico or write raw png
  // Note: Modern browsers and Googlebot fully accept PNG format for favicon.ico as well
  await sharp(masterDarkCircle).resize(48, 48).toFile('public/favicon.ico');
  console.log('Updated public/favicon.ico');

  // Also create a high-DPI SVG with square viewBox and proper safe area margin
  // Embedded base64 png in SVG for 100% fidelity without raster distortion
  const b64 = (await sharp(masterDarkCircle).resize(192, 192).png().toBuffer()).toString('base64');
  const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" width="192" height="192" viewBox="0 0 192 192">
  <image href="data:image/png;base64,${b64}" width="192" height="192"/>
</svg>`;
  fs.writeFileSync('public/favicon.svg', svgContent, 'utf8');
  console.log('Updated public/favicon.svg');

  // Simulation: Test how it looks in Google Search (in both Light & Dark themes)
  // Google search dark theme #202124
  const simNew32 = await sharp('public/favicon-48x48.png').resize(32, 32).toBuffer();
  const googleSimDark = await sharp({
    create: { width: 360, height: 80, channels: 4, background: '#202124' }
  })
    .composite([
      { input: simNew32, left: 300, top: 24 }
    ])
    .png()
    .toBuffer();

  await sharp(googleSimDark).toFile('scripts/screenshots/google_search_sim_dark.png');

  // Google search light theme #FFFFFF
  const googleSimLight = await sharp({
    create: { width: 360, height: 80, channels: 4, background: '#FFFFFF' }
  })
    .composite([
      { input: simNew32, left: 300, top: 24 }
    ])
    .png()
    .toBuffer();

  await sharp(googleSimLight).toFile('scripts/screenshots/google_search_sim_light.png');

  console.log('Generated Google Search simulations!');
}

generate().catch(console.error);
