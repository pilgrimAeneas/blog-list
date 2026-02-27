const { info } = require("./logger")

const requestLogger = (req, res, next) => {
  info(req.method)
  info(req.path)
  info(req.body)
  info("---")
  next()
}

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: "unknown endpoint" })
}

const errorHandler = (error, req, res, next) => {
  info(error.message)

  if (error.name === "ValidationError" &&
    error.message.includes("username")) {
    return res.status(400).send({ error: "Invalid username" })
  }

  if (error.name === "ValidationError" &&
    (error.message.includes("title") || error.message.includes("url"))
  ) {
    return res.status(400).send({ error: "Title or URL missing" })
  }

  if (error.name === "MongoServerError" &&
    error.message.includes("E11000")
  ) {
    return res.status(400).send({ error: "username not unique" })
  }

  if (error.name === "JsonWebTokenError") {
    return res.status(401).send({ error: "invalid token" })
  }

  if (error.name === "TokenExpiredError") {
    return res.status(401).json({ error: "Expired token" })
  }

  next(error)
}

module.exports = { requestLogger, unknownEndpoint, errorHandler }
