const { User, Push, PushComment } = require('../models');
const Dao = require('../daos/dao');

const dao = new Dao();
module.exports = (function () {
    const P = {};

    P.total = async (req, res, next) => {
        const total = await Push.count();
        res.status(200).json({ total });
    };

    P.list = async (req, res, next) => {
        let { page = 1, size: limit = 10} = req.params;
        limit = Number.parseInt(limit);
        const offset = page >=1 ? (page - 1) * limit : 0;
        try {
            const pushs = await Push.findAndCountAll({
                limit,
                offset,
                order: [
                    ['createdAt', 'DESC']
                ]
            });
            if (pushs)
                return res.status(200).json({ pushs });
            else
                return res.status(403).send('Not Found');
        } catch (err) {
            console.log(err);
            return res.status(500).json({ err });
        }
    };

    P.pushComments = async (req, res, next) => {
        let { push_id, page = 1, size: limit = 10 } = req.params;
        limit = Number.parseInt(limit);
        const offset = page >=1 ? (page - 1) * limit : 0;
        try {

            // const post = await dao.findByPk(Post, id);
            // const comments = await post.getComment({ limit, offset });
            // return res.status(200).json({ post, comments });

            const push_comments = await PushComment.findAndCountAll({
                where: {
                    push_id
                },
                limit,
                offset,
                include: [{
                    model: User,
                    as: 'user',
                    required: false,
                }]
            });
            if (push_comments)
                return res.status(200).json({ push_comments });
            else
                return res.status(403).send('Not Found');
        } catch (err) {
            console.log(err);
            return res.status(500).json({ err });
        }
    };
    return P;
})();

