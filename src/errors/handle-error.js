const { validationResult } = require("express-validator");
const { RequestValidationError } = require("./request-validator-error");
const fs = require("fs");

// Handle validation errors
const handleError = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new RequestValidationError(errors.array());
  } else {
    next();
  }
};

// Handle if there is files on errors
const handleFilesError = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    if (req.file) {
      fs.unlink(`${process.cwd()}/${req.file.path}`, (err) =>
        err ? console.error(err) : null
      );
    }

    throw new RequestValidationError(errors.array());
  } else {
    next();
  }
};

module.exports = { handleError, handleFilesError };
