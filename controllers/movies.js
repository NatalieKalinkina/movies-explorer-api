const mongoose = require('mongoose');
const Movie = require('../models/movie');

const {
  OK,
  CREATED,
  MOVIE_INCORRECT_INFO_MESSAGE,
  MOVIE_INCORRECT_ID_MESSAGE,
  MOVIE_NOT_FOUND_MESSAGE,
  MOVIE_FORBIDDEN_MESSAGE,
  MOVIE_SUCCESS_DELETE_MESSAGE,
} = require('../constants');

const NotFoundError = require('../errors/NotFoundError');
const BadRequestError = require('../errors/BadRequestError');
const ForbiddenError = require('../errors/ForbiddenError');

module.exports.getMovies = (req, res, next) => {
  const owner = req.user._id;
  Movie.find({ owner })
    .then((movies) => res.status(OK).send({ movies }))
    .catch((err) => {
      console.log(err);
      next(err);
    });
};

module.exports.createMovie = (req, res, next) => {
  const ownerId = req.user._id;
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
  } = req.body;
  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
    owner: ownerId,
  })
    .then((movie) => {
      res.status(CREATED).send({
        country: movie.country,
        director: movie.director,
        duration: movie.duration,
        year: movie.year,
        description: movie.description,
        image: movie.image,
        trailerLink: movie.trailerLink,
        nameRU: movie.nameRU,
        nameEN: movie.nameEN,
        thumbnail: movie.thumbnail,
        movieId: movie.id,
        owner: {
          email: req.user.email,
          name: req.user.name,
          _id: req.user._id,
        },
      });
    })
    .catch((err) => {
      console.log(err);
      if (err instanceof mongoose.Error.ValidationError) {
        next(new BadRequestError(MOVIE_INCORRECT_INFO_MESSAGE));
      } else {
        next(err);
      }
    });
};

module.exports.deleteMovie = (req, res, next) => {
  const currentUser = req.user._id;
  const movieID = req.params._id;
  Movie.findById(movieID)
    .orFail(new NotFoundError(MOVIE_NOT_FOUND_MESSAGE))
    .populate(['owner'])
    .then((movie) => {
      const movieOwner = movie.owner._id;
      if (JSON.stringify(movieOwner) !== JSON.stringify(currentUser)) {
        throw new ForbiddenError(MOVIE_FORBIDDEN_MESSAGE);
      } else {
        Movie.findOneAndDelete(movie._id)
          .then(() => {
            res.status(OK).send({ message: MOVIE_SUCCESS_DELETE_MESSAGE });
          })
          .catch((err) => {
            console.log(err);
            if (err instanceof mongoose.Error.CastError) {
              next(new BadRequestError(MOVIE_INCORRECT_ID_MESSAGE));
            } else {
              next(err);
            }
          });
      }
    })
    .catch((err) => {
      console.log(err);
      if (err instanceof mongoose.Error.CastError) {
        next(new BadRequestError(MOVIE_INCORRECT_ID_MESSAGE));
      } else {
        next(err);
      }
    });
};
