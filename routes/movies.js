const router = require('express').Router();

const { getMovies, createMovie, deleteMovie } = require('../controllers/movies');
const { validateCreateMovie, validateMovieId } = require('../middlewares/validation');

router.get('/', getMovies);
router.post('/', validateCreateMovie, createMovie);
router.delete('/:_id', validateMovieId, deleteMovie);

module.exports = router;
