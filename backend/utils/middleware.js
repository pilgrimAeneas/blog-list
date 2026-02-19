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
  console.log(error.message)

  // if (error.name === "") {
  //   return res.status(0).send({})
  // } else if (error.name === "") {
  //   return res.status(0).send({})
  // }

  next(error)
}

module.exports = { requestLogger, unknownEndpoint, errorHandler }
