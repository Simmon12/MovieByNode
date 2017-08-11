var User = require('../models/user')


// show signup
exports.showSignup = function(req, res) {
  res.render('signup', {
    title: "注册页"
  })
};

// show signin
exports.showSignin = function(req, res) {
  res.render('signin', {
    title: "登录页"
  })
};


// signup
exports.signup =  function(req, res) {
  var _user = req.body.user
  // req.param('user')

  User.findOne({name: _user.name}, function(err, user) {
    if (err) {
      console.log(err)
    }

    if (user) {
      return res.redirect('/signin')
    }
    else {
      var user = new User(_user)
      user.save(function(err, user) {
        if(err) {
          console.log(err)
        }
        res.redirect('/')
      })
    }
  })
};

// signin
exports.signin =  function(req, res) {
  var _user = req.body.user
  var name = _user.name
  var password = _user.password

  User.findOne({name: name}, function (err, user) {
     if(err) {
      console.log(err)
     }
     if(!user) {
       return res.redirect('/signup')
     }
     user.comparePassword(password, function(err, isMatch) {
        if (err) {
          console.log(err)
        }

        if (isMatch) {
          req.session.user = user
          console.log('Password is  matched')
          return res.redirect('/')
        } else {
          res.redirect('/signin')
          console.log('Password is not matched')
        }
     })
  })
};


// login out
exports.logout = function(req, res) {
  delete req.session.user
  delete req.app.locals.user
  res.redirect('/')
};

// get userList
exports.userList = function(req, res, next) {
    User.fetch(function(err, users) {
      if(err) {
        console.log(err)
      }

      res.render('userList', {
        title: " 用户列表页",
        users: users
      })
    })
};

// list delete movie
exports.delete =  function(req, res) {
     var id = req.query.id
     if(id) {
      User.remove({_id:id}, function(err, movie) {
         if(err) {
          console.log(err)
         }
         else {
          res.json({success: 1})
         }
      })
     }
};

// midware for user 用户权限设置
exports.signinRequired = function(req, res, next) {
  var user = req.session.user;
  if(!user) {
    return res.redirect('/signin')
  }
  next()
};

exports.adminRequired = function(req, res, next) {
  var role = req.session.user.role
  if(role < 10) {
    return res.redirect('/signin')
  }
  next()
}
