require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const cors = require('cors');
const helmet = require('helmet');
const routes = require('./routes/index');

const { requestLogger, errorLogger } = require('./middlewares/logger');

const { exceptionHandler } = require('./middlewares/exceptionHandler');

const { rateLimiter } = require('./middlewares/rateLimiter');

const { PORT = 3000, MONGO_URL = 'mongodb://127.0.0.1:27017/bitfilmsdb' } = process.env;

const app = express();
app.use(cors());
app.use(helmet());
app.use(rateLimiter);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect(MONGO_URL).then(() => {
  console.log('connected to MongoDB');
});

app.use(requestLogger);

app.use(routes);

app.use(errorLogger);

app.use(errors());

app.use(exceptionHandler);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
