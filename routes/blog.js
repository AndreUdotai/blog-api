var express = require('express');
var router = express.Router();

// Require blog controller module
const blog_controller = require("../controllers/blogController");

/* GET home page. */
// router.get('/', function(req, res, next) {
//   res.redirect('/home');
// });

router.get('/posts', blog_controller.post_list);

router.get('/post/:id', blog_controller.post_detail);

router.post('/post/:id/comment/create', blog_controller.comment_create)

module.exports = router;
