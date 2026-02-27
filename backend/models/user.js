const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
  name: String,
  username: {
    type: String,
    required: true,
    unique: true,
  },
  passwordHash: String,
  blogs: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Blog",
    }
  ]
})

userSchema.set("toJSON", {
  transform: (doc, obj) => {
    obj.id = obj._id.toString()
    delete obj.__v
    delete obj._id
    delete obj.passwordHash
  }
})

module.exports = mongoose.model("User", userSchema)