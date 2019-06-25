const { User, Post, Comment } = require('../models');
const Dao = require('../daos/dao');

const dao = new Dao();
module.exports = (function () {
    const P = {};

    P.post = async (req, res, next) => {
        const { post_id: id } = req.params;
        if (!id) return res.status(400).send('Invalid Input');

        try {
            const post = await Post.findOne({
                where: { id },
                include: [{
                    model: User,
                    as: 'user',
                    required: false
                }, {
                    model: Comment,
                    as: 'comments',
                    required: false,
                    limit: 10,
                    offset: 0
                }],
            });
            if (post) {
                return res.status(200).json({ post });
            } else
                return res.status(404).send('Not Found');
        } catch (err) {
            console.log(err);
            return res.status(500).json({ err });
        }
    };

    P.create = async (req, res, next) => {
        try {
            const post = await dao.create(Post, req.body);
            if (post) {
                const user = await post.getUser();
                return res.status(200).json({ post, user });
            } else
                return res.status(400).send('Failed to Create!');
        } catch (err) {
            console.log(err);
            return res.status(500).json({ err });
        }
        // res.send(`create post: ${title}, ${content}, ${userid}`);
        Post.create(req.body)
        .then(post => res.json({ post }))
        .catch(err => res.send(err));
    };

    P.update = async (req, res, next) => {
        const { title, content, post_id: id } = req.body;

        if (!id) return res.status(400).send('Invalid Input');

        try {
            const result = await dao.updateById(Post, { title, content }, id);
            if (result == 1) {
                const post = await Post.findOne({
                    where: { id },
                    include: [{
                            model: Comment,
                            as: 'comments',
                            offset: 0,
                            limit: 10,
                            order: [
                                ['createdAt', 'ASC']
                            ],
                            required: false
                        }, {
                            model: User,
                            as: 'user',
                            required: false
                        }]
                });
                return res.status(200).json({ post });
            } else
                return res.status(400).send('Failed to Update!');
        } catch (err) {
            console.log(err);
            return res.status(500).json({ err });
        }
    };

    P.delete = async (req, res, next) => {
        const { post_id: id } = req.body;
        if (!id) return res.status(400).send('Invalid Input');

        try {
            const result = await dao.destroyById(Post, id);
            if (result == 1)
                return res.status(200).json({ result });
            else
                return res.status(400).send('Failed to Delete!');
        } catch (err) {
            return res.status(500).send(err);
        }
    };

    P.total = async (req, res, next) => {
        const total = await Post.count();
        res.status(200).json({ total });
    };

    P.list = async (req, res, next) => {
        let { page = 1, size: limit = 10} = req.params;
        limit = Number.parseInt(limit);
        const offset = page >=1 ? (page - 1) * limit : 0;
        try {
            const posts = await Post.findAndCountAll({
                limit,
                offset,
                order: [
                    ['createdAt', 'DESC']
                ]
            });
            if (posts)
                return res.status(200).json({ posts });
            else
                return res.status(403).send('Not Found');
        } catch (err) {
            console.log(err);
            return res.status(500).json({ err });
        }
    };

    P.postComments = async (req, res, next) => {
        let { post_id, page = 1, size: limit = 10 } = req.params;
        limit = Number.parseInt(limit);
        const offset = page >=1 ? (page - 1) * limit : 0;
        try {

            // const post = await dao.findByPk(Post, id);
            // const comments = await post.getComment({ limit, offset });
            // return res.status(200).json({ post, comments });

            const comments = await Comment.findAndCountAll({
                where: {
                    post_id
                },
                limit,
                offset,
                include: [{
                    model: User,
                    as: 'user',
                    required: false,
                }]
            });
            if (comments)
                return res.status(200).json({ comments });
            else
                return res.status(403).send('Not Found');
        } catch (err) {
            console.log(err);
            return res.status(500).json({ err });
        }
    };
    return P;
})();

