var mongoose = require('mongoose')
var Schema = mongoose.Schema
var ObjectId = Schema.Types.ObjectId

var CommentSchema = new Schema({
  movie: {
    type: ObjectId,
    ref: 'Movie'
  },
  from: {
    type: ObjectId,
    ref: 'User'
  },
  reply: [{
    from: {type: ObjectId, ref: 'User'},
    to: {type: ObjectId, ref: 'User'},
    content: String
  }],
  content: String,
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
CommentSchema.pre('save', function(next) {
  if(this.isNew) {
    this.meta.createAt = this.meta.updateAt = Date.now()
  }
  else {
    this.meta.updateAt = Date.now()
  }

  next()
})

// 给模式CommentSchema添加静态方法，fetch查询所有数据，findbyId,
CommentSchema.statics = {
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

module.exports = CommentSchema
