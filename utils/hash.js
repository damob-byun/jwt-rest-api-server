const bcrypt = require('bcrypt');
const { random } = require('lodash');
const SALT = 10
module.exports = (function () {
    const H = {};

    H.generateHashPassword = (txt_password) =>{
        let salt = bcrypt.genSaltSync()
        let hash_password = bcrypt.hashSync(txt_password, salt);
        return {salt,hash_password};
    }

    H.checkPassword = (txt_password,salt,db_password) =>{
        return bcrypt.compareSync(txt_password, db_password);
    }
    return H;
})();
