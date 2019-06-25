const Sequelize = require('sequelize');
const path = require('path');
const fs = require('fs');

const { MYSQL_DB, MYSQL_DB_USER, MYSQL_DB_PASSWORD, MYSQL_DB_HOST } = process.env;

const sequelize = new Sequelize(
    MYSQL_DB,
    MYSQL_DB_USER,
    MYSQL_DB_PASSWORD,
    {
        host: MYSQL_DB_HOST,
        dialect: 'mysql',
        timezone: '+09:00',
        operatorsAliases: Sequelize.Op,
        pool: {
            max: 5,
            min: 0,
            idle: 10000
        }
    }
);

let db = [];

fs.readdirSync(__dirname)
    .filter(file => {
        return file.indexOf('.js') && file !== 'index.js'
    })
    .forEach(file => {
        // console.log('----', __dirname, '\n', path.join(__dirname, file), '\n', __filename);
        const model = sequelize.import(path.join(__dirname, file));
        db[model.name] = model;
    });


Object.keys(db).forEach(modelName => {
    // console.log('modelName', modelName);
    if("associate" in db[modelName]){
        db[modelName].associate(db);
    }
});

db.sequelize = sequelize;

module.exports = db;
