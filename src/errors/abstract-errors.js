exports.AbstractError = class AbstractError extends Error {
  constructor(error, statusCode) {
    super()
    this.errors = error
    this.name = 'AbstractError'
    this.statusCode = statusCode
  }

  /**
   * Serializes error message to be ready to be sent to the client
   *
   * @returns array of error messages [{message: 'error message', field: fieldName }, ...]
   */
  serializeErrors() {
    if (Array.isArray(this.errors))
      return this.errors.map(e => ({
        message: e.msg || e.message,
        field: e.param || e.field,
      }))

    return [
      {
        message: this.errors.msg || this.errors.message || this.errors,
        field: this.errors.param || this.errors.field,
      },
    ]
  }
}
