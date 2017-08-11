var _underscore = require('underscore');
var Category = require('../models/category')

exports.admin =  function(req, res, next) {
    res.render('categoryAdmin', {
      title: "后端分类录入页",
      category: {
          name: '',
          movies: []
      }
    });
};


// admin post movie
exports.new =  function(req, res) {
  var _category = req.body.category
  var category = new Category(_category)

  category.save(function(err, category) {
    if (err) {
      console.log(err)
    }

    res.redirect('/admin/category/list')
  })

};

//category list page
exports.list =  function(req, res, next) {
    Category.fetch(function(err, categories) {
      if(err) {
        console.log(err)
      }

      res.render('categorylist', {
        title: "分类列表页",
        categories: categories
      })
    })
};


// list delete movie
exports.delete =  function(req, res) {
     var id = req.query.id
     if(id) {
      Category.remove({_id:id}, function(err, movie) {
         if(err) {
          console.log(err)
          console.log("sdkfjlsdf");
         }
         else {
          res.json({success: 1})
         }
      })
     }
};
