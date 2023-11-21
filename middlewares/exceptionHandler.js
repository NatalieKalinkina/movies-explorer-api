const { SERVER_ERROR } = require('../constants');

const exceptionHandler = (err, req, res, next) => {
  if (err.statusCode === SERVER_ERROR) {
    res.status(SERVER_ERROR).send({ message: 'Server error' });
  } else {
    res.status(err.statusCode).send({ message: err.message });
  }
  next();
};

module.exports = { exceptionHandler };
