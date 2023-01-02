var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.redirect('/home');
});

router.get('/home', blog_controller.post_list);

router.get('/post/:id', blog_controller.post_detail);

router.post('/post/:id/comment/create', blog_controller.comment_create_post)

module.exports = router;
