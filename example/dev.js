const { config, include } = require("../../exconfig");

config("database", {
  "adapter": "mysql2",
  "database": "project_dev",
  "host": "127.0.0.1",
  "port": 3306,
  "pool": 5,
  "timeout": 5000,
});

config("kafka", {
  "brokers": [
    {"host": "127.0.0.1", "port": 9092},
    {"host": "127.0.0.1", "port": 9093},
    {"host": "127.0.0.1", "port": 9094}
  ],
  "clientId": "dev_kafka"
});

include("./local.js");
include("./private.json");
