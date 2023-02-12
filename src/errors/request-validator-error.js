const { AbstractError } = require('./abstract-errors')

exports.RequestValidationError = class RequestValidationError extends (
  AbstractError
) {
  constructor(errors) {
    super(errors)
    this.errors = errors
    this.name = 'RequestValidationError'
    this.statusCode = 400
  }
}
