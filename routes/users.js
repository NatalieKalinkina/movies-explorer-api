const router = require('express').Router();

const { getUser, updateUser } = require('../controllers/users');
const { validateUpdateUser } = require('../middlewares/validation');

router.get('/', getUser);
router.patch('/', validateUpdateUser, updateUser);

module.exports = router;
