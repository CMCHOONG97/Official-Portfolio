const fs = require('fs');
const path = require('path');

const projectsDir = path.join(__dirname, '../static/projects');
const outputPath = path.join(__dirname, '../static/data/projects.json');

const supportedImages = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];

const output = [];

fs.readdirSync(projectsDir).forEach(folder => {
  const folderPath = path.join(projectsDir, folder);

  if (fs.statSync(folderPath).isDirectory()) {
    const files = fs.readdirSync(folderPath);

    // 自动获取所有图片文件
    const images = files
      .filter(file => supportedImages.includes(path.extname(file).toLowerCase()))
      .map(file => `static/projects/${folder}/${file}`);

    // 获取文字内容（如有）
    const title = folder.replace(/[-_]/g, ' ').replace(/\b\w/g, c => c.toUpperCase());

    const description = fs.existsSync(path.join(folderPath, 'description.txt'))
      ? fs.readFileSync(path.join(folderPath, 'description.txt'), 'utf8').trim()
      : null;

    const tech = fs.existsSync(path.join(folderPath, 'tech.txt'))
      ? fs.readFileSync(path.join(folderPath, 'tech.txt'), 'utf8').trim()
      : null;

    const github = fs.existsSync(path.join(folderPath, 'github.txt'))
      ? fs.readFileSync(path.join(folderPath, 'github.txt'), 'utf8').trim()
      : null;

    const link = fs.existsSync(path.join(folderPath, 'link.txt'))
      ? fs.readFileSync(path.join(folderPath, 'link.txt'), 'utf8').trim()
      : null;
    
    // 添加到最终项目数组
    output.push({ title, description, tech, github, link, images });
  }
});

// 写入 JSON 文件
fs.writeFileSync(outputPath, JSON.stringify(output, null, 2), 'utf8');
console.log(`✅ ${output.length} projects exported to ${outputPath}`);
