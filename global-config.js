const fs = require('fs');

function isObject(item) {
  return (item && typeof item === 'object' && !Array.isArray(item));
}

function mergeDeep(target, source) {
  let output = Object.assign({}, target);
  if (isObject(target) && isObject(source)) {
    Object.keys(source).forEach(key => {
      if (isObject(source[key])) {
        if (!(key in target))
          Object.assign(output, { [key]: source[key] });
        else
          output[key] = mergeDeep(target[key], source[key]);
      } else {
        Object.assign(output, { [key]: source[key] });
      }
    });
  }

  return output;
}

function startAutoreload() {
  global[CONF_SYM]._configFiles.forEach((filename) => {
    if (global[CONF_SYM]._autoreloadWatchers[filename] === undefined) {
      global[CONF_SYM]._autoreloadWatchers[filename] = fs.watch(filename, (event, filename) => {
        if (event === 'change') {
          global[CONF_SYM].reload();
        }
      });
    }
  });
}

function stopAutoreload() {
  Object.keys(global[CONF_SYM]._autoreloadWatchers).forEach((filename) => {
    global[CONF_SYM]._autoreloadWatchers[filename].close();
  });
  global[CONF_SYM]._autoreloadWatchers = {};
}

function setAutoreload() {
  if (global[CONF_SYM]._autoreload) {
    startAutoreload();
  } else {
    stopAutoreload();
  }
};

const CONF_SYM = Symbol.for("Ex.Config.Singleton");
var globalSymbols = Object.getOwnPropertySymbols(global);
var hasSTSuite = (globalSymbols.indexOf(CONF_SYM) > -1);
if (!hasSTSuite) {
  global[CONF_SYM] = {
    _onReload: undefined,
    _autoreload: false,
    _configFiles: [],
    _autoreloadWatchers: {},
    _preReloadConf: {},
    _conf: {},

    _registerConfigFile: (filename) => {
      if (global[CONF_SYM]._configFiles.indexOf(filename) < 0) {
        global[CONF_SYM]._configFiles.push(filename);
        return true;
      }
      return false;
    },

    config: (key, obj) => {
      if (key && obj) {
        let newConf = {};
        newConf[key] = obj;
        global[CONF_SYM]._conf = mergeDeep(global[CONF_SYM]._conf, newConf);
      }
      if (key) {
        return global[CONF_SYM]._conf[key] || global[CONF_SYM]._preReloadConf[key];
      }
      return global[CONF_SYM]._conf;
    },

    include: (filename) => {
      if (global[CONF_SYM]._registerConfigFile(filename)) {
        const newConf = require(filename);
        global[CONF_SYM]._conf = mergeDeep(global[CONF_SYM]._conf, newConf);
      };
      setAutoreload();
    },

    load: (filename, {autoreload, onReload} = {}) => {
      global[CONF_SYM]._autoreload = (autoreload !== undefined) ? autoreload : global[CONF_SYM]._autoreload;
      global[CONF_SYM].onReload(onReload);
      global[CONF_SYM].include(filename);
    },

    infos: () => global[CONF_SYM]._configFiles,

    autoreload: (enable) => {
      if (enable !== undefined) {
        global[CONF_SYM]._autoreload = enable;
        setAutoreload();
      }
      return global[CONF_SYM]._autoreload
    },

    onReload: (fun) => {
      global[CONF_SYM]._onReload = (typeof(fun) === 'function') ? fun : global[CONF_SYM]._onReload;
    },

    reload: () => {
      if(typeof(global[CONF_SYM]._onReload) === 'function') { global[CONF_SYM]._onReload(); }
      stopAutoreload()
      global[CONF_SYM]._preReloadConf = global[CONF_SYM]._conf;
      const rootConfigFile = global[CONF_SYM]._configFiles[0];
      global[CONF_SYM]._configFiles.forEach((filename) => {
        delete require.cache[require.resolve(filename)];
      });
      global[CONF_SYM]._conf = {};
      global[CONF_SYM]._configFiles = [];
      global[CONF_SYM].include(rootConfigFile);
      global[CONF_SYM]._preReloadConf = {};
    }
  }
};

var singleton = {};

Object.defineProperty(singleton, "instance", {
  get: () => { return global[CONF_SYM]; },
});

Object.freeze(singleton);

module.exports = singleton;
