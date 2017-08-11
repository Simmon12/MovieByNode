var Movie = require('../models/movie');
var Category = require('../models/category')

/* Get index page */
exports.index =  function(req, res, next) {
  Category
    .find({})
    .populate({path: 'movies', options: {limit: 5}})
    .exec(function(err, categories) {
      if(err) {
        console.log(err)
      }
      res.render('index', {
        title: '首页',
        categories: categories
      })
    })

};

/* Get search page */
exports.search =  function(req, res, next) {
  var catId = req.query.cat
  var q = req.query.q
  var page = parseInt(req.query.p, 10) || 0
  var pageSize = 1
  var index = page * pageSize
  if (catId) {      // 点击标题进入
    Category
        .find({_id: catId})
        .populate({
           path: 'movies',
           select: 'title poster',
          //  options: { limit: pageSize, skip: index } (为了实现分页显示，这里需注释)
         })
        .exec(function(err, categories) {   // 成功返回的categories只有一条数据
          if(err) {
            console.log(err)
          }
          var category = categories[0] || {}
          console.log("categories", categories)
          console.log("category", category)
          var movies = category.movies || []
          var results = movies.slice(index, index + pageSize)
          res.render('results', {
            title: '结果列表页',
            keyword: category.name,
            currentPage: (page + 1),
            query: 'cat=' + catId,
            totalPage: Math.ceil(movies.length / pageSize),
            movies: results
          })
        })
  } else {    // 搜索进入
    Movie
    .find({title: new RegExp(q + '.*', 'i')})  // i修饰符用于执行对于大小写不敏感的匹配
    .exec(function(err, movies) {   // 成功返回的categories只有一条数据
          if(err) {
            console.log(err)
          }
          var results = movies.slice(index, index + pageSize)
         // console.log("movies: ", movies)
          //console.log("movies.length: ", movies.length)
          //console.log("totalPage: ", Math.ceil(movies.length / pageSize))
          res.render('results', {
            title: '结果列表页',
            keyword: q,
            currentPage: (page + 1),
            query: 'q' + catId,
            totalPage: Math.ceil(movies.length / pageSize),
            movies: results
          })
        })

  }

};
