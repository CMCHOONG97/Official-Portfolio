// ============================================
// 本地开发用（可选）：监听 static/projects/ 的变化，
// 一变化就自动重新生成 static/data/projects.json，
// 让你本地用 Live Server 预览时马上看到最新效果。
//
// 纯本地脚本，不需要任何账号/网络/费用。
// 部署到 Netlify 时不需要跑这个，netlify.toml 已经会
// 在每次部署时自动跑一次 generateProjects.js。
//
// 用法： node dev-watch.js
// ============================================

const chokidar = require('chokidar');
const { exec } = require('child_process');
const path = require('path');

const watchDir = path.join(__dirname, 'static/projects');
const genScript = path.join(__dirname, 'scripts/generateProjects.js');

console.log(`👀 本地监听中： ${watchDir}`);
console.log('（改动 description.txt / 加图片 / 新增项目文件夹都会自动重新生成 projects.json）');

function regenerate() {
  exec(`node "${genScript}"`, (err, stdout, stderr) => {
    if (stdout) console.log(stdout.trim());
    if (err) console.error('❌ 生成出错：', stderr || err.message);
  });
}

chokidar
  .watch(watchDir, { ignoreInitial: true })
  .on('add', regenerate)
  .on('change', regenerate)
  .on('unlink', regenerate)
  .on('addDir', regenerate)
  .on('unlinkDir', regenerate);
