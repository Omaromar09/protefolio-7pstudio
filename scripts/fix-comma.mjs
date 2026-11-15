import fs from 'node:fs';
let code = fs.readFileSync('src/utils/i18n.js', 'utf8');
code = code.replace(
  "testimonialsDesc: 'Real feedback from partners we built websites for and authentic comments from our TikTok showcase videos:'",
  "testimonialsDesc: 'Real feedback from partners we built websites for and authentic comments from our TikTok showcase videos:',"
);
fs.writeFileSync('src/utils/i18n.js', code, 'utf8');
console.log('Fixed English trailing comma successfully!');
