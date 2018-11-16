const { config, include } = require("../../exconfig");

config("database", {
  "database": "project_dev_local",
  "timeout": 10000
});

config("kafka", {
  "brokers": [
    {"host": "127.0.0.1", "port": 9092}
  ]
});
