const {User, Post, Comment, PersonalPush, Push, AttachFiles, PersonalSetting} = require('../models');
const sequelize = require('sequelize');
const Dao = require('../daos/dao');
const hash = require('../utils/hash');
const jwt = require('../utils/jwt');
const dao = new Dao();
module.exports = (function () {
    const U = {};
    U.checkDuplicate = async (req, res, next) => {
        let {email} = req.body;
        console.log(email)
        if (!email) return res.status(400).send('Invalid Input');
        try {
            const user_dao = await dao.findByEmail(User, email);
            if (user_dao) {
                return res.status(200).json({result: true});
            } else {
                return res.status(200).json({result: false});
            }
        } catch (err) {
            //const user = await dao.findByPk(User, id);
            return res.status(400).send(err);
        }
    };
    /*
        user_object = {

            id:
        }


     */
    U.signUp = async (req, res, next) => {
        let body = req.body;
        if (!body.email || !body.password || !body.name) return res.status(400).send('Invalid Input');
        try {

            let user_object = req.body
            let hash_object = hash.generateHashPassword(user_object.password)
            user_object.password = hash_object.hash_password
            user_object.salt = hash_object.salt
            let user = await dao.create(User, user_object);
            let setting_object = {
                push:true
            }
            let setting = await dao.create(PersonalSetting, {user_id:user.id,setting_json:JSON.stringify(setting_object)});
            let token = jwt.getToken(user.id)
            if (user)
                return res.status(200).json({result: true, token: token});
            else
                return res.status(403).send('Not Found');
        } catch (err) {
            //const user = await dao.findByPk(User, id);
            if (err.name == 'SequelizeUniqueConstraintError') {
                res.status(200).send({result: "false", reason: "email_error"});
            } else {
                res.status(400).send("sign_up_error");
                console.log(err)
            }


        }
    };
    U.login = async (req, res, next) => {
        if (!req.body.email) return res.status(400).send('Invalid Input');

        try {
            console.log(req.body)
            const user_dao = await dao.findByEmail(User, req.body.email);
            const user = user_dao.dataValues
            //console.log(user)
            if (!user) return res.status(400).send('login error');
            if (hash.checkPassword(req.body.password, user.salt, user.password)) {
                let token = jwt.getToken(user.id)
                return res.status(200).json({result: true, token: token});
            } else {
                return res.status(200).json({result: false});
            }
        } catch (err) {
            return res.status(200).json({result: false});
        }
    };
    U.updateToken = async (req, res, next) => {
        let {token, receive_key } = req.body
        if (!token) return res.status(400).send('Invalid Token');
        try {
            let decoded = jwt.verifyToken(token)
            if (!decoded)
                return res.status(403).send('Not Found');

            const result = await dao.updateById(User, {receive_key}, decoded.id);
            if (result == 1) {
                return res.status(200).json({result : true});
            } else
                return res.status(400).send({result : false});
        } catch (err) {
            return res.status(500).json({err});
        }
    }
    U.updateSetting = async (req, res, next) => {
        let {token, setting_json } = req.body
        if (!token) return res.status(400).send('Invalid Token');
        try {
            let decoded = jwt.verifyToken(token)
            if (!decoded)
                return res.status(403).send('Not Found');
            let settings = await User.findOne({
                where: {
                    id : decoded.id
                },
                include: [{
                    model: PersonalSetting,
                    as: 'personal_setting',
                }]
            });
            console.log(settings["dataValues"].personal_setting["dataValues"])
            if(settings["dataValues"].personal_setting["dataValues"].id){
                const result = await dao.updateById(PersonalSetting, {setting_json}, settings["dataValues"].personal_setting["dataValues"].id);
                if (result == 1) {
                    return res.status(200).json({result : true});
                } else
                    return res.status(400).send({result : false});
            }else{
                return res.status(400).send({result : false});
            }
        } catch (err) {
            return res.status(500).json({err});
        }
    }
    /*U.update = async (req, res, next) => {
        return res.status(401).send('API Unauthorized');
        const {user_id: id, name} = req.body;
        if (!id) return res.status(400).send('Invalid Input');

        try {
            const result = await dao.updateById(User, {name}, id);
            if (result == 1) {
                const comment = await dao.findByPk(User, id);
                return res.status(200).json({User});
            } else
                return res.status(400).send('Failed to Update!');
        } catch (err) {
            return res.status(500).json({err});
        }
    };*/

   /* U.delete = async (req, res, next) => {
        return res.status(401).send('API Unauthorized');
        const {user_id: id} = req.body;
        if (!id) return res.status(400).send('Invalid Input');
        try {
            const result = await dao.destroyById(User, id);
            if (result == 1)
                return res.status(200).json({result});
            else
                return res.status(400).send('Failed to Delete!');
        } catch (err) {
            return res.status(500).send(err);
        }
    };*/
    U.info = async (req, res, next) => {
        if (!req.body.token) return res.status(400).send('Invalid Token');
        try {
            let decoded = jwt.verifyToken(req.body.token)
            //console.log(decoded)
            const result = await User.findOne({
                where: {
                    id : decoded.id
                },
                // attributes: [ [sequelize.fn('COUNT', 'id'), 'PostCount'] ],
                include: [{
                    model: PersonalSetting
                }]
            });
            const user = result.dataValues
            user.password = ""
            user.salt = ""
            if (user)
                return res.status(200).json({user});
            else
                return res.status(403).send('Not Found');
        } catch (err) {
            return res.status(400).send(err);
        }
    };

    U.userPushs = async (req, res, next) => {
        //if (!req.body.token) return res.status(400).send('Invalid Token');
        let {token: token} = req.query
        let {page = 1, size: limit = 10} = req.params;
        limit = Number.parseInt(limit);
        try {
            // 아래와 같은 결과
            // const user = await dao.findByPk(User, id);
            // const posts = await user.getPost({ limit, offset });
            // return res.status(200).json({ user, posts });
            let decoded = jwt.verifyToken(token)
            limit = Number.parseInt(limit);
            console.log(decoded)
            const offset = page >= 1 ? (page - 1) * limit : 0;
            //console.log(decoded)
            if (!decoded)
                return res.status(403).send('Not Found');
            const result = await User.findOne({
                where: {
                    id : decoded.id
                },
                // attributes: [ [sequelize.fn('COUNT', 'id'), 'PostCount'] ],
                include: [{
                    model: PersonalPush,
                    as: 'personal_pushs',
                    order: [
                        ['createdAt', 'DESC']
                    ],
                    limit,
                    offset,
                    required: false,
                    include : [{
                        model: Push,
                        as: 'push',
                        order: [
                            ['createdAt', 'DESC']
                        ],
                        required: false,
                        include : [{
                            model: AttachFiles,
                            as: 'attach_files',
                            order: [
                                ['createdAt', 'DESC']
                            ],

                        }]

                    }]
                }]
            });
            if (result)
                return res.status(200).json({result});
            else
                return res.status(403).send('Not Found');
        } catch (err) {
            console.log(err);
            return res.status(500).json({err});
        }
    };

    U.userPosts = async (req, res, next) => {
        let {token: token} = req.query
        let {page = 1, size: limit = 10} = req.params;
        limit = Number.parseInt(limit);
        const offset = page >= 1 ? (page - 1) * limit : 0;
        try {
            // 아래와 같은 결과
            // const user = await dao.findByPk(User, id);
            // const posts = await user.getPost({ limit, offset });
            // return res.status(200).json({ user, posts });
            let decoded = jwt.verifyToken(token)

            //console.log(decoded)
            if (!decoded)
                return res.status(403).send('Not Found');
            const result = await User.findOne({
                where: {
                    id: decoded.id
                },
                // attributes: [ [sequelize.fn('COUNT', 'id'), 'PostCount'] ],
                include: [{
                    model: PushComment,
                    as: 'push_comments',
                    order: [
                        ['createdAt', 'DESC']
                    ],
                    limit,
                    offset,
                    required: false,
                }]
            });
            if (result)
                return res.status(200).json({result});
            else
                return res.status(403).send('Not Found');
        } catch (err) {
            console.log(err);
            return res.status(500).json({err});
        }
    };

    U.userComments = async (req, res, next) => {
        let {token: token, page = 1, size: limit = 10} = req.params;
        limit = Number.parseInt(limit);
        const offset = page >= 1 ? (page - 1) * limit : 0;
        try {
            let decoded = jwt.verifyToken(token)

            //console.log(decoded)
            if (!decoded)
                return res.status(403).send('Not Found');
            const user = await User.findByPk(id);
            if (user) {
                const comments = await Comment.findAndCountAll({
                    where: {
                        id: decoded.id,
                    },
                    order: [
                        ['createdAt', 'ASC']
                    ],
                    limit,
                    offset,
                    required: false
                });
                return res.status(200).json({user, comments});
            } else
                return res.status(403).send('Not Found');
        } catch (err) {
            console.log(err);
            return res.status(500).json({err});
        }
    };

    return U;
})();

