const router = require('express').Router();
const { postController: controller } = require('../controllers');

router.get('/:post_id([\\d]+)?', controller.post);
router.post('/', controller.create);
router.put('/', controller.update);
router.delete('/', controller.delete);

router.get('/total', controller.total);
router.get('/list/:page([\\d]+)?/:size([\\d]+)?', controller.list);
router.get('/list/comment/:postId/:page([\\d]+)?/:size([\\d]+)?', controller.postComments);

module.exports = router;
