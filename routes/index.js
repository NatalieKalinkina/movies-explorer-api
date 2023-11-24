const router = require('express').Router();

const auth = require('../middlewares/auth');
const { validateRegistration, validateLogin } = require('../middlewares/validation');
const { createUser, login } = require('../controllers/users');
const userRouter = require('./users');
const movieRouter = require('./movies');
const NotFoundError = require('../errors/NotFoundError');

router.post('/signup', validateRegistration, createUser);
router.post('/signin', validateLogin, login);

router.use(auth);

router.use('/users/me', userRouter);
router.use('/movies', movieRouter);

router.use(() => {
  throw new NotFoundError('Такой страницы не существует');
});

module.exports = router;
