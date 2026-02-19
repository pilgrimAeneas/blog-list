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

module.exports = { requestLogger, unknownEndpoint }