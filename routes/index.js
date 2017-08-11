var express = require('express');
var router = express.Router();
var Movie = require('../app/controller/movie');
var Index = require('../app/controller/index');
var User = require('../app/controller/user');
var Comment = require('../app/controller/comment');
var Category = require('../app/controller/category')


// 重点理解原因
// app.use(bodyParser.urlencoded({ extended: true }));


// 预先判断登录情况
router.use(function(req, res, next) {
  var _user = req.session.user
  if(_user) {
    req.app.locals.user = _user
  }
  return next()
})


/* Get index page */
router.get('/', Index.index );

/* Movie */
router.get('/movie/:id', Movie.detail);
router.get('/admin/movie', User.signinRequired, User.adminRequired, Movie.admin);
router.get('/admin/movie/update/:id', User.signinRequired, User.adminRequired, Movie.update);
router.post('/admin/movie/new', User.signinRequired, User.adminRequired, Movie.savePoster, Movie.new);
router.get('/admin/movie/list', User.signinRequired, User.adminRequired, Movie.list);
router.delete('/admin/movie/list', User.signinRequired, User.adminRequired,  Movie.delete);

/*User*/
router.post('/user/signup', User.signup);
router.post('/user/signin', User.signin);
router.get('/logout', User.logout);
router.get('/admin/user/list', User.signinRequired, User.adminRequired, User.userList);
router.get('/signup', User.showSignup);
router.get('/signin', User.showSignin);
router.delete('/admin/user/list', User.delete);

/*Comment*/
router.post('/user/comment', User.signinRequired, Comment.new)

/*Category*/
router.get('/admin/category', User.signinRequired, User.adminRequired, Category.admin)
router.post('/admin/category/new', User.signinRequired, User.adminRequired, Category.new)
router.get('/admin/category/list', User.signinRequired, User.adminRequired, Category.list)
router.delete('/admin/category/list', User.signinRequired, User.adminRequired, Category.delete)

/*results*/
router.get('/results', Index.search)


module.exports = router;
