const express = require("express");
const router = require("./routes");
const errorHandler = require("./middleware/errorHandler");
const passport = require("passport");
const configurePassport = require("./config/passport");

const app = express();

// body parser
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// passport
app.use(passport.initialize());
configurePassport(passport);

// routes
app.use("/api/v1", router);

// error handler
app.use(errorHandler);

module.exports = app;
