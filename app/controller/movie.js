var _underscore = require('underscore');
var Movie = require('../models/movie');
var Comment = require('../models/comment');
var Category = require('../models/category')
var fs = require('fs')
var path = require('path')

/* GET detail page. */
exports.detail =  function(req, res, next) {
  var id = req.params.id;

  Movie.findById(id, function(err, movie) {
    Movie.update({_id: id}, {$inc: {pv: 1}}, function(err) {
      if (err) {
        console.log(err)
      }
    })
    Comment
      .find({movie: id})
      .populate('from', 'name')
      .populate('reply.from reply.to', 'name')
      .exec(function(err, comments) {
         console.log("comments", comments)
        res.render('detail', {
          title: '详情页',
          movie: movie,
          comments: comments
        })
      })
  })
};

exports.admin =  function(req, res, next) {
  Category.find({}, function(err, categories) {
    res.render('admin', {
      title: "后端录入页",
      categories: categories,
      movie: {}
    });
  })

};

// admin update move
exports.update =  function(req, res) {
  var id = req.params.id

  if(id) {
    Movie.findById(id, function(err, movie) {
      if(err) {
        console.log(err)
        return;
      }
      Category.find({}, function(err, categories) {
          res.render('admin', {
          title: '后台更新页',
          movie: movie,
          categories: categories
        })
      })

    })
  }
};


// admin poster
exports.savePoster = function (req, res, next) {
  var posterData = req.files.uploadPoster
  var filePath = posterData.path
  var originalFilename = posterData.originalFilename

  console.log(req.files)

  // 有文件的名字，说明上传文件存在
  if(originalFilename) {
    fs.readFile(filePath, function(err, data) {
      var timestamp = Date.now()    //声明一个时间戳来命名新的图片文字
      var type = posterData.type.split('/')[1]  // png或者是jpg split按照斜线取得第二个值
      var poster = timestamp + '.' + type    // poster表示海报新的名字
      var newPath = path.join(__dirname, '../../', '/public/upload/' + poster)
      console.log("path:dfdsffff  ", newPath)
      fs.writeFile(newPath, data, function(err) {

        req.poster = poster
        next()
      })
    })
  }
  else {
    next()
  }
}



// admin post movie
exports.new =  function(req, res) {
  var id = req.body.movie._id
  var movieObj = req.body.movie
  console.log("movieObj: ", movieObj)
  var _movie

  if(req.poster) {
    movieObj.poster = req.poster
    console.log("我被选中了")
  }

  if(id) {
    Movie.findById(id, function(err, movie) {
      if(err) {
        console.log(err)
      }
     /* _movie = _underscore.extend(movie, movieObj)  // 将movieObj替换movie
      console.log("_movie1: ", _movie);
      _movie.save(function(err, movie) {
        if(err) {
          console.log(err)
        }
        res.redirect('/movie/' + movie._id)
      })
    })*/
      var originCategoryId = movie.category.toString();
      Movie.findOneAndUpdate({_id: id}, movieObj, {new: true}, function(err, movie) {
        if(err) {
          console.log(err)
          return;
        }
        if(originCategoryId === movie.category.toString()) {
          console.log('is equal')
        } else {
          Category.findById(originCategoryId, function(err, category) {
            if(err) {
              console.log(err)
              return;
            }
            category.movies.splice(category.movies.indexOf(movie._id), 1);
            category.save(function(err,category) {
              if(err) {
                console.log(err)
                return
              }
            })

            Category.findById(movie.category.toString(), function(err, category) {
              if (err) {
                console.log(err)
                return
              }
              category.movies.push(movie);
              category.save(function(err, category) {
                if(err) {
                  console.log(err)
                  return
                }
              })
            })
          })
        }
        res.redirect('/movie/' + movie._id)
      })
  })


  }
  else {
    _movie = new Movie(movieObj)
    var categoryId = movieObj.category
    var categoryName = movieObj.categoryName
    _movie.save(function(err, movie) {
      if(err) {
          console.log(err)
        }
      if (categoryId) {
          Category.findById(categoryId, function(err, category) {
          category.movies.push(movie._id)
          category.save(function(err, category) {
             res.redirect('/movie/' + movie._id)
          })
        })
        } else if (categoryName) {
          var category = new Category({
            name: categoryName,
            movies: [movie._id]
          })
          category.save(function(err, category) {
            movie.category = category._id
            movie.save(function (err, movie) {
              res.redirect('/movie/' + movie._id )
            })

          })

        }

    })
  }

};

exports.list =  function(req, res, next) {
    Movie.fetch(function(err, movies) {
      if(err) {
        console.log(err)
      }

      res.render('movieList', {
        title: "列表页",
        movies: movies
      })
    })
};


// list delete movie
exports.delete =  function(req, res) {
     var id = req.query.id
     if(id) {
      Movie.remove({_id:id}, function(err, movie) {
         if(err) {
          console.log(err)
         }
         else {
          res.json({success: 1})
         }
      })
     }
};


