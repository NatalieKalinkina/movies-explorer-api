const BAD_REQUEST = 400;
const UNAUTHORIZED = 401;
const FORBIDDEN = 403;
const NOT_FOUND = 404;
const CONFLICT = 409;
const SERVER_ERROR = 500;
const OK = 200;
const CREATED = 201;

const USER_SCHEMA_VALIDATE_EMAIL_MESSAGE = 'Формат введенного email не корректен';
const MOVIE_SCHEMA_VALIDATE_URL_MESSAGE = 'не является корректным url';
const MOVIE_INCORRECT_INFO_MESSAGE = 'Переданы некорректные данные при создании фильма';
const MOVIE_INCORRECT_ID_MESSAGE = 'Передан некорректный формат _id фильма';
const MOVIE_NOT_FOUND_MESSAGE = 'Фильм с указанным _id не найден';
const MOVIE_FORBIDDEN_MESSAGE = 'Нельзя удалить фильм, сохраненный другим пользователем';
const MOVIE_SUCCESS_DELETE_MESSAGE = 'Фильм успешно удален';
const USER_NOT_FOUND_MESSAGE = 'Пользователь по указанному _id не найден';
const USER_INCORRECT_INFO_MESSAGE = 'Переданы некорректные данные при обновлении профиля';
const USER_UPDATE_INCORRECT_INFO_MESSAGE = 'Переданы некорректные данные при создании пользователя';
const USER_CONFLICT_MESSAGE = 'Пользователь с таким email уже зарегистрирован';
const USER_UNAUTHORIZED_MESSAGE = 'Неправильные почта или пароль';

const URL_REGEXP = /^(http|https):\/\/(([A-Z0-9][A-Z0-9_-]*)(\.[A-Z0-9][A-Z0-9_-]*)+)/im;

const MONGO_URL_DEV = 'mongodb://127.0.0.1:27017/bitfilmsdb';

const PORT_DEV = 3000;

const SALT_ROUNDS = 10;

module.exports = {
  BAD_REQUEST,
  UNAUTHORIZED,
  FORBIDDEN,
  NOT_FOUND,
  CONFLICT,
  SERVER_ERROR,
  OK,
  CREATED,
  URL_REGEXP,
  MONGO_URL_DEV,
  PORT_DEV,
  SALT_ROUNDS,
  MOVIE_INCORRECT_INFO_MESSAGE,
  MOVIE_INCORRECT_ID_MESSAGE,
  MOVIE_NOT_FOUND_MESSAGE,
  MOVIE_FORBIDDEN_MESSAGE,
  MOVIE_SUCCESS_DELETE_MESSAGE,
  USER_NOT_FOUND_MESSAGE,
  USER_INCORRECT_INFO_MESSAGE,
  USER_UPDATE_INCORRECT_INFO_MESSAGE,
  USER_CONFLICT_MESSAGE,
  USER_UNAUTHORIZED_MESSAGE,
  USER_SCHEMA_VALIDATE_EMAIL_MESSAGE,
  MOVIE_SCHEMA_VALIDATE_URL_MESSAGE,
};
