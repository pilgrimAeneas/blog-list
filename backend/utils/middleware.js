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

  if (error.name === "ValidationError") {
    return res.status(400).send({ error: "Title or URL missing" })
  }

  if (error.name === "MongoServerError" &&
    error.message.includes("E11000")
  ) {
    return res.status(400).send({ error: "username not unique" })
  }

  next(error)
}

module.exports = { requestLogger, unknownEndpoint, errorHandler }
