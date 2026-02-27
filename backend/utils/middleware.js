const jwt = require("jsonwebtoken")
const User = require("../models/user")
const { SECRET } = require("./config")
const { info } = require("./logger")

const requestLogger = (request, response, next) => {
  info(request.method)
  info(request.path)
  info(request.body)
  info("---")
  next()
}

const tokenExtractor = (request, response, next) => {
  const getTokenFrom = request => {
    const authorization = request.get("authorization")
    if (authorization && authorization.startsWith("Bearer")) {
      return authorization.replace("Bearer ", "")
    }

    return null
  }

  request.token = getTokenFrom(request)
  next()
}

const userExtractor = async (request, response, next) => {
  const decodedToken = jwt.verify(request.token, SECRET)
  if (!decodedToken.id) {
    return response.status(401).send({ error: "invalid token" })
  }

  const tokenHolder = await User.findById(decodedToken.id)
  if (!tokenHolder) {
    return response.status(400).json({ error: "user ID missing or not valid" })
  }

  request.user = tokenHolder
  next()
}

const unknownEndpoint = (req, response) => {
  response.status(404).send({ error: "unknown endpoint" })
}

const errorHandler = (error, req, response, next) => {
  info(error.message)

  if (error.name === "CastError") {
    return response.status(400).send({ error: "Malformatted ID" })
  }

  if (error.name === "ValidationError" &&
    error.message.includes("username")) {
    return response.status(400).send({ error: "Invalid username" })
  }

  if (error.name === "ValidationError" &&
    (error.message.includes("title") || error.message.includes("url"))
  ) {
    return response.status(400).send({ error: "Title or URL missing" })
  }

  if (error.name === "MongoServerError" &&
    error.message.includes("E11000")
  ) {
    return response.status(400).send({ error: "username not unique" })
  }

  if (error.name === "JsonWebTokenError") {
    return response.status(401).send({ error: "invalid token" })
  }

  if (error.name === "TokenExpiredError") {
    return response.status(401).json({ error: "Expired token" })
  }

  next(error)
}

module.exports = {
  requestLogger,
  userExtractor,
  tokenExtractor,
  unknownEndpoint,
  errorHandler,
}
