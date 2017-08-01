var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Movie = require('../models/movie')
var _underscore = require('underscore')

mongoose.connect('mongodb://localhost/imovie')

// 重点理解原因
// app.use(bodyParser.urlencoded({ extended: true }));

/* Get index page */
router.get('/', function(req, res, next) {
    Movie.fetch(function(err, movies) {
      if(err) {
        console.log(err)
      }
      res.render('index', {
        title: '首页',
        movies: movies
      });
    })
});

/* GET detail page. */
router.get('/movie/:id', function(req, res, next) {
  console.log("req.pqrams: ", req.params)
  var id = req.params.id;

  Movie.findById(id, function(err, movie) {
     res.render('detail', {
       title: 'immoc' + movie.title,
       movie: movie
     })
  })

});

router.get('/admin/movie', function(req, res, next) {
    res.render('admin', {
      title: "后端录入页",
      movie: {
        title: '',
        doctor: '',
        country: '',
        year: '',
        poster: '',
        flash: '',
        summary: '',
        language: ''
      }
    });
});

// admin update move
router.get('/admin/update/:id', function(req, res) {
  var id = req.params.id

  if(id) {
    Movie.findById(id, function(err, movie) {
      res.render('admin', {
        title: 'immoc 后台更新页',
        movie: movie
      })
    })
  }
})


// admin post movie
router.post('/admin/movie/new', function(req, res) {
  var id = req.body.movie._id
  var movieObj = req.body.movie
  console.log("movieObj: ", movieObj)
  var _movie

  if(id !== 'undefined') {
    Movie.findById(id, function(err, movie) {
      if(err) {
        console.log(err)
      }
      _movie = _underscore.extend(movie, movieObj)  // 将movieObj替换movie
      console.log("_movie1: ", _movie);
      _movie.save(function(err, movie) {
        if(err) {
          console.log(err)
        }
        res.redirect('/movie/' + movie._id)
      })
    })
  }
  else {
    _movie = new Movie({
      doctor: movieObj.doctor,
      title: movieObj.title,
      country: movieObj.country,
      language: movieObj.language,
      year: movieObj.year,
      poster: movieObj.poster,
      summary: movieObj.summary,
      flash: movieObj.flash
    })
    console.log("_movie2", _movie);
    _movie.save(function(err, movie) {
      if(err) {
          console.log(err)
        }
        res.redirect('/movie/' + movie._id)
    })
  }

})

router.get('/admin/list', function(req, res, next) {
    Movie.fetch(function(err, movies) {
      if(err) {
        console.log(err)
      }

      res.render('list', {
        title: "列表页",
        movies: movies
      })
    })
})

// list delete movie
router.delete('/admin/list' , function(req, res) {
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
})


module.exports = router;
