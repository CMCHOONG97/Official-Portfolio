const fs = require('fs');
const path = require('path');

// 设置路径
const projectsDir = 'D:\\Picture\\Personal\\Official Web\\cmcng97.com (Edit)\\static\\Project';
const outputDir = 'D:\\OfficialWeb\\website';
const outputPath = path.join(outputDir, 'projects.json');

// 自动创建输出目录
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
  console.log(`📁 创建输出目录：${outputDir}`);
}

const output = [];

fs.readdirSync(projectsDir).forEach(folder => {
  const projectPath = path.join(projectsDir, folder);
  if (fs.lstatSync(projectPath).isDirectory()) {
    try {
      const descriptionPath = path.join(projectPath, 'description.txt');
      const techPath = path.join(projectPath, 'tech.txt');
      const githubPath = path.join(projectPath, 'github.txt');
      const image = `projects/${encodeURIComponent(folder)}/preview.jpg`;

      if (!fs.existsSync(descriptionPath)) throw new Error('❌ description.txt 缺失');
      if (!fs.existsSync(techPath)) throw new Error('❌ tech.txt 缺失');
      if (!fs.existsSync(githubPath)) throw new Error('❌ github.txt 缺失');

      const description = fs.readFileSync(descriptionPath, 'utf-8').trim();
      const tech = fs.readFileSync(techPath, 'utf-8').trim();
      const github = fs.readFileSync(githubPath, 'utf-8').trim();

      const title_en = folder.replace(/[-_]/g, ' ').replace(/&/g, 'and');

      output.push({
        title_en: title_en,
        title_zh: '', // 预留多语言
        description_en: description,
        description_zh: '', // 预留多语言
        tech,
        github,
        image
      });
    } catch (err) {
      console.log(`⚠️  项目「${folder}」资料不完整 → ${err.message}`);
    }
  }
});

fs.writeFileSync(outputPath, JSON.stringify(output, null, 2), 'utf-8');
console.log(`✅ ${output.length} 个项目成功写入 → ${outputPath}`);