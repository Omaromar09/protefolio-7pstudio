import sharp from 'sharp';

async function cropAvatars() {
  const dir = 'C:/Users/dell/.gemini/antigravity/brain/d9841a97-9a70-4edc-b6c6-036a57727001/.user_uploaded/';

  // 1. Mohamed Ahmed
  await sharp(dir + 'media_1794507348804_80659161.jpg')
    .extract({ left: 35, top: 48, width: 95, height: 95 })
    .resize(120, 120)
    .jpeg({ quality: 90 })
    .toFile('public/testimonials/tiktok-mohamed-ahmed.jpg');

  // 2. ITZ.NDA
  await sharp(dir + 'media_1794507348815_957a398f.jpg')
    .extract({ left: 35, top: 62, width: 98, height: 98 })
    .resize(120, 120)
    .jpeg({ quality: 90 })
    .toFile('public/testimonials/tiktok-itz-nda.jpg');

  // 3. Sama
  await sharp(dir + 'media_1794507348810_af69f1bf.jpg')
    .extract({ left: 35, top: 32, width: 95, height: 95 })
    .resize(120, 120)
    .jpeg({ quality: 90 })
    .toFile('public/testimonials/tiktok-sama.jpg');

  // 4. Moustafa
  await sharp(dir + 'media_1794507348810_af69f1bf.jpg')
    .extract({ left: 35, top: 258, width: 95, height: 95 })
    .resize(120, 120)
    .jpeg({ quality: 90 })
    .toFile('public/testimonials/tiktok-moustafa.jpg');

  // 5. Mohamed Tech
  await sharp(dir + 'media_1794507348806_e09e5b19.jpg')
    .extract({ left: 35, top: 28, width: 98, height: 98 })
    .resize(120, 120)
    .jpeg({ quality: 90 })
    .toFile('public/testimonials/tiktok-mohamed-tech.jpg');

  // 6. Aya Store (TikTok comment)
  await sharp(dir + 'media_1794507348857_0868a160.jpg')
    .extract({ left: 10, top: 485, width: 55, height: 55 })
    .resize(120, 120)
    .jpeg({ quality: 90 })
    .toFile('public/testimonials/tiktok-aya-store.jpg');

  console.log('Avatars cropped successfully!');
}

cropAvatars().catch(console.error);
