const router = require('express').Router();
const { userController: controller } = require('../controllers');

// router.get('/:userId', controller.user);
// router.post('/', controller.create);
// router.put('/', controller.update);
// router.delete('/', controller.delete);
//
// router.get('/list/:page([\\d]+)?/:size([\\d]+)?', controller.list);
router.get('/list/push/:page([\\d]+)?/:size([\\d]+)?', controller.userPushs);
router.get('/list/post/:page([\\d]+)?/:size([\\d]+)?', controller.userPosts);
router.get('/list/comment/:token/:page([\\d]+)?/:size([\\d]+)?', controller.userComments);
router.post('/login', controller.login);
router.post('/duplicate_check', controller.checkDuplicate);
router.post('/sign_up', controller.signUp);
router.post('/info', controller.info);
router.post('/update/token', controller.updateToken);
router.post('/update/setting', controller.updateSetting);
module.exports = router;
