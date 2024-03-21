require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const { errors } = require("celebrate");
const cors = require("cors");
const helmet = require("helmet");
const routes = require("./routes/index");

const { requestLogger, errorLogger } = require("./middlewares/logger");

// const { exceptionHandler } = require("./middlewares/exceptionHandler");

// const { rateLimiter } = require("./middlewares/rateLimiter");

const { MONGO_URL_DEV, PORT_DEV } = require("./constants");

const { PORT, MONGO_URL, NODE_ENV } = process.env;

const app = express();

app.use(cors());

app.use(function (req, res, next) {
  res.header(
    "Access-Control-Allow-Origin",
    "https://movies-explorer-frontend-3syg.onrender.com"
  );
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.header("Access-Control-Allow-Methods", "GET,HEAD,PUT,PATCH,POST,DELETE");

  next();
});

app.use(helmet());
// app.use(rateLimiter);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose
  .connect(NODE_ENV === "production" ? MONGO_URL : MONGO_URL_DEV)
  .then(() => {
    console.log("connected to MongoDB");
  });

app.use(requestLogger);

app.use(routes);

app.use(errorLogger);

app.use(errors());

// app.use(exceptionHandler);

app.listen(NODE_ENV === "production" ? PORT : PORT_DEV);
