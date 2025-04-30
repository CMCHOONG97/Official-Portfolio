const chokidar = require('chokidar');
const { exec } = require('child_process');

chokidar.watch('D:\\OfficialWeb\\Project', {ignored: /^\./, persistent: true})
  .on('add', () => run())
  .on('change', () => run())
  .on('unlink', () => run());

function run() {
  console.log("🔄 Detected change, regenerating...");
  exec('node generateProjects.js', (err, stdout) => {
    if (!err) console.log(stdout);
  });
}
