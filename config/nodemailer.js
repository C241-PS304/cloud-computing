const nodemailer = require("nodemailer");
const config = require("./config");

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: config.nodemailerEmailUser,
    pass: config.nodemailerEmailPass,
  },
});

module.exports = transporter;
