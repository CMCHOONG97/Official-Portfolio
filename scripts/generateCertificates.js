const fs = require('fs');
const path = require('path');

const certsDir = path.join(__dirname, '../static/certificates');
const outputPath = path.join(__dirname, '../static/data/certificates.json');

function readIfExists(filePath) {
  return fs.existsSync(filePath) ? fs.readFileSync(filePath, 'utf8').trim() : null;
}

function parseLinks(filePath) {
  if (!fs.existsSync(filePath)) return [];
  return fs.readFileSync(filePath, 'utf8')
    .split('\n')
    .map(line => line.trim())
    .filter(Boolean)
    .map(line => {
      const [label, url] = line.split('|').map(s => s.trim());
      return { label, url };
    });
}

const folders = fs.readdirSync(certsDir).filter(f =>
  fs.statSync(path.join(certsDir, f)).isDirectory()
);

const certificates = folders.map(folder => {
  const folderPath = path.join(certsDir, folder);
  const files = fs.readdirSync(folderPath);
  const pdfFile = files.find(f => f.toLowerCase().endsWith('.pdf'));

  return {
    title: readIfExists(path.join(folderPath, 'title.txt')) || folder,
    issuer: readIfExists(path.join(folderPath, 'issuer.txt')),
    details: readIfExists(path.join(folderPath, 'details.txt')),  // ← Course Details 弹窗内容
    pdf: pdfFile ? `static/certificates/${folder}/${pdfFile}` : null,
    links: parseLinks(path.join(folderPath, 'links.txt')),
  };
});

fs.writeFileSync(outputPath, JSON.stringify(certificates, null, 2));
console.log(`✅ 已生成 ${certificates.length} 张证书到 static/data/certificates.json`);