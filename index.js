const path = require('path');
const globalConfig = require('./global-config').instance;

function _getCallerFile() {
  var originalFunc = Error.prepareStackTrace;

  var callerfile;
  try {
    var err = new Error();
    var currentfile;

    Error.prepareStackTrace = function (err, stack) { return stack; };

    currentfile = err.stack.shift().getFileName();

    while (err.stack.length) {
      callerfile = err.stack.shift().getFileName();

      if(currentfile !== callerfile) break;
    }
  } catch (e) {}

  Error.prepareStackTrace = originalFunc; 

  return callerfile;
}

function _correctPath(filename) {
  if (filename[0] === '/') {
    return filename;
  }
  return path.join(path.dirname(_getCallerFile()), filename);
}

module.exports = {
  config: (key, obj) => {
    if (obj) {
      const configFile = _getCallerFile();
      globalConfig._registerConfigFile(configFile);
    }
    return globalConfig.config(key, obj)
  },

  include: (filename) => {
    globalConfig.include(_correctPath(filename));
  },

  load: (filename, options) => {
    globalConfig.load(_correctPath(filename), options);
    return module.exports;
  },

  infos: () => globalConfig.infos(),

  autoreload: (enable) => globalConfig.autoreload(enable),

  onReload: (fun) => { globalConfig.onReload(fun); return this; },

  reload: () => { globalConfig.reload(); },
};
