import fs from 'fs';

let content = fs.readFileSync('src/utils/i18n.js', 'utf8');

// Update Arabic section
content = content.replace("heroProofProjectsVal: '6 مشاريع'", "heroProofProjectsVal: '7 مشاريع'");
content = content.replace("heroProofIndustriesVal: '6 مجالات'", "heroProofIndustriesVal: '7 مجالات'");
content = content.replace("heroProofIndustriesLabel: 'متاجر، مطاعم، مساحات، جيمينج، 3D'", "heroProofIndustriesLabel: 'متاجر، زهور، مطاعم، مساحات، جيمينج، 3D'");
content = content.replace("trustLiveHeader: '6 نماذج ومشاريع لايف", "trustLiveHeader: '7 نماذج ومشاريع لايف");

// Add mobileWorkFlowers in Arabic
const arAnchor = "mobileWorkAyaTag: 'سلة مشتريات وطلب واتساب مباشر',";
const arAdd = arAnchor + "\r\n    mobileWorkFlowersName: 'بوتيك زهور جاردان فيفانت (تجريبي)',\r\n    mobileWorkFlowersTag: 'زهور وبتلات 3D تفاعلية وشحن مبرد',";
content = content.replace(arAnchor, arAdd);

// Update English section
content = content.replace("heroProofProjectsVal: '6 Projects'", "heroProofProjectsVal: '7 Projects'");
content = content.replace("heroProofIndustriesVal: '6 Domains'", "heroProofIndustriesVal: '7 Domains'");
content = content.replace("heroProofIndustriesLabel: 'Stores, Food, Gaming, 3D'", "heroProofIndustriesLabel: 'Stores, Florals, Food, Gaming, 3D'");
content = content.replace("trustLiveHeader: '6 live models & projects", "trustLiveHeader: '7 live models & projects");

// Add mobileWorkFlowers in English
const enAnchor = "mobileWorkAyaTag: 'Cart & Direct WhatsApp Ordering',";
const enAdd = enAnchor + "\r\n    mobileWorkFlowersName: 'Jardin Vivant Luxury Florals (Demo)',\r\n    mobileWorkFlowersTag: 'Interactive 3D Flora & Chilled Delivery',";
content = content.replace(enAnchor, enAdd);

fs.writeFileSync('src/utils/i18n.js', content, 'utf8');
console.log('Successfully updated src/utils/i18n.js');
