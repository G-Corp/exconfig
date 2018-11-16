const exconfig = require('../../exconfig').load('./dev.js', {autoreload: false, onReload: () => {
  console.log("RELOADING !!!");
}});

console.log(JSON.stringify(exconfig.config()));
