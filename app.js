const express = require('express');
const dotenv = require('dotenv');
dotenv.config();

const hash = require('./utils/hash')
const logger = require('morgan');
const bodyParser = require('body-parser');

const {PORT} = process.env;

const db = require('./models');

const app = express();

// middleware
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.get('/', (req, res) => {
    res.send('root route');
});
const routers = require('./routes');
app.use('/api/user', routers.userRouter);
app.use('/api/post', routers.postRouter);
app.use('/api/comment', routers.commentRouter);

app.listen(PORT, _ => {
    console.log('Express server running on', PORT);
});
const {random, times, forEach} = require('lodash');
const faker = require('faker');
const uuidv4 = require('uuid/v4');
const faker_kr = require('faker/locale/ko');
// mysql db create dummy data
db.sequelize
    .authenticate()
    .then(async () => {
        console.log('Connection has been established successfully.');
        await db.sequelize.sync({force: false});

        const user_ids = await db.User.findAll().map(user => user.id);
        if (user_ids.length > 0) {
            return
        }
        const password_object = hash.generateHashPassword("1")
        const user_list = times(30, () => ({
            email: `${faker.internet.email()}`,
            name: `${faker_kr.name.lastName()}${faker_kr.name.firstName()}`,
            salt: password_object.salt,
            password: password_object.hash_password
        }))
        user_list[0].email = "justice032@naver.com"
        let users = await db.User.bulkCreate(user_list);
        let created_user_ids = users.map(user => user.id);

        let posts = await db.Post.bulkCreate(
            times(30, () => ({
                title: faker.lorem.sentence(),
                content: faker.lorem.paragraph(),
                user_id: created_user_ids[random(0, 29)]
            }))
        );

        let post_ids = posts.map(post => post.id);
        await db.Comment.bulkCreate(
            times(300, () => ({
                content: faker.lorem.sentence(),
                user_id: created_user_ids[random(0, 29)],
                post_id: post_ids[random(0, 10)]
            }))
        );


        let pushs = await db.Push.bulkCreate(
            times(30, () => ({
                title: faker.lorem.sentence(),
                content: faker.lorem.paragraph(),
                summary: faker.lorem.sentence()
            }))
        );

        let comment_count = {}
        let push_ids = pushs.map(push => push.id);
        let attach_files = await db.AttachFiles.bulkCreate(
            times(50, () => {
                    let file_id = uuidv4()
                    return {
                        file_name: file_id,
                        file_path: file_id,
                        push_seq: push_ids[random(0, 29)]
                    }
                }
            )
        );
        let comment_array = times(100, () => {
            let random_id = push_ids[random(0, 29)]
            if (comment_count[random_id]) {
                comment_count[random_id] = 1;
            } else {
                comment_count[random_id] = comment_count[random_id] + 1;
            }
            return {
                title: faker.lorem.sentence(),
                content: faker.lorem.paragraph(),
                summary: faker.lorem.paragraph(),
                user_id: created_user_ids[random(0, 29)],
                push_seq: random_id
            }
        })
        await db.PushComment.bulkCreate(comment_array);
        let update_pushs = await db.Push.bulkCreate(
            forEach(comment_count, (n, key) => ({
                id: key,
                comment_count: comment_count[key]
            }), {updateOnDuplicate: true})
        );

        await db.PersonalPush.bulkCreate(
            times(100, () => {
                let push = pushs[random(0, 29)]
                return {
                    title: push.title,
                    content: push.content,
                    summary: push.summary,
                    user_id: created_user_ids[random(0, 29)],
                    push_seq: push.id
                }
            })
        );

        let settings = await db.PersonalSetting.bulkCreate(
            times(30, (index) => {
                    return {
                        setting_json: JSON.stringify({push:true}),
                        user_id:(index+1)
                    }
                }
            )
        );


    })
    .then(() => {
        console.log('DB Sync complete.');

    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
    });
