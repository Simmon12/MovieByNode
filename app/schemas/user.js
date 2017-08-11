var mongoose = require('mongoose')
var bcrypt = require('bcrypt-nodejs')
SALUT_WORK_FACTOR = 10

var UserSchema = new mongoose.Schema({
  name: {
    unique: true,
    type: String
  },
  password: String,
  // normal admin whose role < 10
  // super admin whose role >= 10
  role: {
    type: Number,
    default: 0
  },
  meta: {
    createAt: {
      type: Date,
      default: Date.now()
    },
    updateAt: {
      type: Date,
      default: Date.now()
    }
  }
})

// 每次存储数据之前都会先调用这个方法
UserSchema.pre('save', function(next) {
  var user = this
  if(this.isNew) {
    this.meta.createAt = this.meta.updateAt = Date.now()
  }
  else {
    this.meta.updateAt = Date.now()
  }

  bcrypt.genSalt(SALUT_WORK_FACTOR, function(err, salt) {
    if(err)  return next(err)
      bcrypt.hash(user.password, salt, null, function(err, hash) {
        if(err) return next(err)

        user.password = hash
        next()
      })
  })

})

// 实例方法
UserSchema.methods = {
  comparePassword: function(_password, cb) {
    bcrypt.compare(_password, this.password, function(err, isMatch) {
         if (err) return cd(err)
         cb(null, isMatch)
    })
  }
}

// 给模式UserSchema添加静态方法，fetch查询所有数据，findbyId,
UserSchema.statics = {
  fetch: function(cb) {    //取出数据库中的所有数据
    return this
       .find({})
       .sort('meta.updateAt')  // 按照更新时间排序
       .exec(cb)             // 执行回调方法
  },
  findById: function(id, cb) {
    return this
      .findOne({_id: id})
      .exec(cb)
  }
}

module.exports = UserSchema
