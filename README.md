

## <a id="db"> DB 설정</a>

- MySQL
- Create DB, user for the project

```mysql
CREATE DATABASE board_test;
CREATE USER 'class'@'localhost' IDENTIFIED BY '101';
GRANT ALL PRIVILEGES ON board_test.* TO 'class'@'localhost';
FLUSH PRIVILEGES;
```



## <a id="setting">Project Setting</a>

- node.js: v10.15.3
- npm packages

```bash
  {
    "name": "jwt-rest-nodejs-by-bjs",
    "version": "1.0.0",
    "description": "",
    "main": "app.js",
    "scripts": {
      "start": "nodemon start app.js -V -e js",
      "test": "mocha"
    },
    "author": "BJS",
    "license": "ISC",
    "homepage": "https://ablestor.com",
    "dependencies": {
      "dotenv": "^8.0.0",
      "express": "^4.17.0",
      "express-jwt": "^5.3.1",
      "jsonwebtoken": "^8.5.1",
      "moment": "^2.24.0",
      "mysql2": "^1.6.5",
      "sequelize": "^5.8.6"
    },
    "devDependencies": {
      "bcrypt": "^3.0.6",
      "eslint": "^5.16.0",
      "faker": "^4.1.0",
      "lodash": "^4.17.11",
      "mocha": "^6.1.4",
      "morgan": "^1.9.1",
      "nodemon": "^1.19.0"
    }
  }

```

- How to start

```bash
# install packages
npm i
# start
nodemon start
```





### <a id="dummy">Setup Dummy Data</a>

```js
// app.js
//mysql db create dummy data 부터 끝까지
```







