const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const list = [
  {
    id: 1,
    src: 'C:/Users/dell/Desktop/WhatsApp Image 2026-10-21 at 1.48.26 PM.jpeg',
    crop: { left: 0, top: 0, width: 3060, height: 4080 },
    outW: 900, outH: 1200,
    avatar: { left: 1300, top: 1500, width: 750, height: 750 },
    pos: '52% 42%'
  },
  {
    id: 2,
    src: 'C:/Users/dell/Desktop/WhatsApp Image 2026-10-21 at 1.48.25 PM.jpeg',
    crop: { left: 0, top: 0, width: 1200, height: 1600 },
    outW: 900, outH: 1200,
    avatar: { left: 380, top: 480, width: 440, height: 440 },
    pos: '50% 38%'
  },
  {
    id: 3,
    src: 'C:/Users/dell/Desktop/1.jpeg',
    crop: { left: 0, top: 0, width: 1200, height: 1600 },
    outW: 900, outH: 1200,
    avatar: { left: 190, top: 600, width: 430, height: 430 },
    pos: '35% 45%'
  },
  {
    id: 4,
    src: 'C:/Users/dell/Desktop/2.jpeg',
    crop: { left: 0, top: 0, width: 1200, height: 1600 },
    outW: 900, outH: 1200,
    avatar: { left: 400, top: 520, width: 420, height: 420 },
    pos: '50% 40%'
  },
  {
    id: 5,
    src: 'C:/Users/dell/Desktop/WhatsApp Image 2026-10-21 at 1.48.26 PM3.jpeg',
    crop: { left: 0, top: 0, width: 1200, height: 1600 },
    outW: 900, outH: 1200,
    avatar: { left: 340, top: 340, width: 460, height: 460 },
    pos: '45% 40%'
  },
  {
    id: 6,
    src: 'C:/Users/dell/Desktop/22.jpeg',
    crop: { left: 0, top: 220, width: 900, height: 1200 },
    outW: 900, outH: 1200,
    avatar: { left: 220, top: 380, width: 500, height: 500 },
    pos: '50% 45%'
  }
];

async function run() {
  const outDir = path.join(__dirname, '../public/photos');
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  for (const item of list) {
    await sharp(item.src)
      .extract(item.crop)
      .resize(item.outW, item.outH)
      .webp({ quality: 88 })
      .toFile(path.join(outDir, `photo-${item.id}.webp`));

    await sharp(item.src)
      .extract(item.avatar)
      .resize(180, 180)
      .webp({ quality: 90 })
      .toFile(path.join(outDir, `photo-${item.id}-avatar.webp`));

    console.log(`Successfully generated photo-${item.id}.webp and avatar`);
  }
}

run().catch(err => {
  console.error('Error processing photos:', err);
  process.exit(1);
});
