# eXConfig

eXtended Configuration module

> This module is freely inspired by the [Elixir's Mix.Config module](https://hexdocs.pm/mix/Mix.Config.html)

## Getting start

### Create your configuration 

`config/dev.js` : 
```
const { config, include } = require('exconfig');

config("database", {
  "adapter": "mysql2",
  "database": "project_dev",
  "host": "127.0.0.1",
  "port": 3306,
  "pool": 5,
  "timeout": 5000
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
```

`config/local.js` :
```
const { config, include } = require('exconfig');

config("database", {
  "database": "project_dev_local",
  "timeout": 10000
});

config("kafka", {
  "brokers": [
    {"host": "127.0.0.1", "port": 9092}
  ]
});
```

`config/private.json` :
```
{
  "database": {
    "username": "john_doe",
    "password": "s3cr3tP4ssw0rd"
  }
}
```

### Load your configuration

```
const exconfig = require('exconfig').load('config/dev.js', {autoreload: true, onReload: () => {
  console.log("RELOADING !!!");
}});

console.log(exconfig.config()); 
// =>
// {
//  "database": {
//    "adapter": "mysql2",
//    "database": "project_dev_local",
//    "host": "127.0.0.1",
//    "port": 3306,
//    "pool": 5,
//    "timeout": 10000,
//    "username": "john_doe",
//    "password": "s3cr3tP4ssw0rd"
//  },
//  "kafka": {
//    "brokers": [
//      {
//        "host": "127.0.0.1",
//        "port": 9092
//      }
//    ],
//    "clientId": "dev_kafka"
//  }
//} 
```

You can also load the configuration like that :

```
const exconfig = require('exconfig');
exconfig.load('config/conf.js', {autoreload: true, onReload: () => {
  console.log("RELOADING !!!");
}});
```

Or like that :

```
require('./config/conf');
const exconfig = require('exconfig');
exconfig.autoreload(true);
exconfig.onReload(() => {
  console.log("RELOADING !!!");
});
```

When the configuration has been loaded in a first time, it is available everywhere via the exconfig module.

You can force a configuration reload by using `exconfig.reload();`

## Licence

Copyright (c) 2018, Grégoire Lejeune<br />
All rights reserved.

Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:

1. Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
1. Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
1. The name of the author may not be used to endorse or promote products derived from this software without specific prior written permission.


THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
