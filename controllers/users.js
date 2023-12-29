const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const { NODE_ENV, JWT_SECRET } = process.env;

const {
  OK,
  CREATED,
  SALT_ROUNDS,
  USER_NOT_FOUND_MESSAGE,
  USER_INCORRECT_INFO_MESSAGE,
  USER_UPDATE_INCORRECT_INFO_MESSAGE,
  USER_CONFLICT_MESSAGE,
  USER_UNAUTHORIZED_MESSAGE,
} = require('../constants');

const NotFoundError = require('../errors/NotFoundError');
const BadRequestError = require('../errors/BadRequestError');
const ConflictError = require('../errors/ConflictError');
const UnauthorizedError = require('../errors/UnauthorizedError');

module.exports.getUser = (req, res, next) => {
  User.findById(req.user._id)
    .orFail(() => {
      throw new NotFoundError(USER_NOT_FOUND_MESSAGE);
    })
    .then((user) => res.status(OK).send({
      email: user.email,
      name: user.name,
    }))
    .catch((err) => {
      console.log(err);
      next(err);
    });
};

module.exports.updateUser = (req, res, next) => {
  const { name, email } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, email }, { new: true, runValidators: true })
    .orFail(new NotFoundError(USER_NOT_FOUND_MESSAGE))
    .then((user) => res.status(OK).send({
      email: user.email,
      name: user.name,
    }))
    .catch((err) => {
      console.log(err);
      if (err.code === 11000) {
        next(new ConflictError(USER_CONFLICT_MESSAGE));
      }
      if (err instanceof mongoose.Error.ValidationError) {
        next(new BadRequestError(USER_INCORRECT_INFO_MESSAGE));
      } else {
        next(err);
      }
    });
};

module.exports.createUser = (req, res, next) => {
  const {
    email,
    password,
    name,
  } = req.body;
  bcrypt.hash(password, SALT_ROUNDS)
    .then((hash) => User.create({
      email,
      password: hash,
      name,
    }))
    .then((user) => res.status(CREATED).send({
      _id: user._id,
      email: user.email,
      name: user.name,
    }))
    .catch((err) => {
      console.log(err);
      if (err.code === 11000) {
        next(new ConflictError(USER_CONFLICT_MESSAGE));
      }
      if (err instanceof mongoose.Error.ValidationError) {
        next(new BadRequestError(USER_UPDATE_INCORRECT_INFO_MESSAGE));
      } else {
        next(err);
      }
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        next(new UnauthorizedError(USER_UNAUTHORIZED_MESSAGE));
      } else {
        bcrypt.compare(password, user.password)
          .then((matched) => {
            if (!matched) {
              next(new UnauthorizedError(USER_UNAUTHORIZED_MESSAGE));
            } else {
              const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'secret-key', { expiresIn: '7d' });
              res.status(OK).send({ token });
            }
          });
      }
    })
    .catch((err) => {
      console.log(err);
      next(err);
    });
};
