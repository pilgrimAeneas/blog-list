require("dotenv").config()

const NODE_ENV = process.env.NODE_ENV
const MONGODB_URL = NODE_ENV !== "test"
  ? process.env.MONGODB_URL
  : process.env.TEST_MONGODB_URL
const PORT = process.env.PORT
const SECRET = process.env.SECRET

module.exports = { MONGODB_URL, PORT, SECRET, NODE_ENV }
