const mongoose = require("mongoose")

const blogSchema = mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  author: String,
  url: {
    type: String,
    required: true
  },
  likes: Number,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
})

blogSchema.set("toJSON", {
  transform: (document, object) => {
    object.id = object._id.toString()
    delete object._id
    delete object.__v
  }
})

module.exports = mongoose.model("Blog", blogSchema)
