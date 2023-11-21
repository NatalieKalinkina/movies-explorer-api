const mongoose = require('mongoose');
const Movie = require('../models/movie');

const {
  OK,
  CREATED,
} = require('../constants');

const NotFoundError = require('../errors/NotFoundError');
const BadRequestError = require('../errors/BadRequestError');
const ForbiddenError = require('../errors/ForbiddenError');

module.exports.getMovies = (req, res, next) => {
  Movie.find({})
    .populate(['owner'])
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
        next(new BadRequestError('Переданы некорректные данные при создании фильма'));
      } else {
        next(err);
      }
    });
};

module.exports.deleteMovie = (req, res, next) => {
  const currentUser = req.user._id;
  const movieID = req.params._id;
  Movie.findById(movieID)
    .orFail(new NotFoundError('Фильм с указанным _id не найден'))
    .populate(['owner'])
    .then((movie) => {
      const movieOwner = movie.owner._id;
      if (JSON.stringify(movieOwner) !== JSON.stringify(currentUser)) {
        throw new ForbiddenError('Нельзя удалить фильм, сохраненный другим пользователем');
      } else {
        Movie.findOneAndDelete(movie._id)
          .then(() => {
            res.status(OK).send({ message: 'Фильм успешно удален' });
          })
          .catch((err) => {
            console.log(err);
            if (err instanceof mongoose.Error.CastError) {
              next(new BadRequestError('Передан некорректный формат _id фильма'));
            } else {
              next(err);
            }
          });
      }
    })
    .catch((err) => {
      console.log(err);
      if (err instanceof mongoose.Error.CastError) {
        next(new BadRequestError('Передан некорректный формат _id фильма'));
      } else {
        next(err);
      }
    });
};
