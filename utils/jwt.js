const { SECRET } = process.env;
const jwt = require('jsonwebtoken')
module.exports = (function () {
    const J = {};

    J.getToken = (id) =>{
        let token = jwt.sign({
            id: id
        }, SECRET,{ expiresIn: 60 * 60 });
        return token;
    }

    J.verifyToken = (token) =>{
        let decoded = jwt.verify(token, SECRET);
        return decoded;
    }
    return J;
})();
