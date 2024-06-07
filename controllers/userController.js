const { body, validationResult, matchedData } = require("express-validator");
const {
  createUserAccount,
  updateUserProfile,
  loginUser,
} = require("../services/userService");
const { query, collection, where, getDocs } = require("firebase/firestore");
const { db } = require("../config/firebase");
const { validationError } = require("../helpers/validationError");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const config = require("../config/config");

const validateSignup = [
  body("email")
    .custom(async (value) => {
      const q = query(collection(db, "users"), where("email", "==", value));
      const snapshot = await getDocs(q);

      if (!snapshot.empty) {
        throw new Error("Email sudah terdaftar");
      }
    })
    .isEmail()
    .withMessage("Harap masukkan email yang valid")
    .notEmpty()
    .withMessage("Email tidak boleh kosong"),

  body("password")
    .isLength({ min: 3 })
    .withMessage("Password harus memiliki minimal 3 karakter")
    .notEmpty()
    .withMessage("Password tidak boleh kosong"),
];

const signup = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      status: "error",
      code: 400,
      errors: validationError(errors.array()),
    });
  }

  const { email, password } = matchedData(req);

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await createUserAccount(email, hashedPassword);

    res.status(201).json({
      status: "success",
      code: 201,
      message: "Registrasi berhasil",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

const validateLogin = [
  body("email").notEmpty().withMessage("Email tidak boleh kosong"),

  body("password").notEmpty().withMessage("Password tidak boleh kosong"),
];

const login = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      status: "error",
      code: 400,
      errors: validationError(errors.array()),
    });
  }

  const { email, password } = matchedData(req);

  try {
    const user = await loginUser(email, password);

    if (!user) {
      res
        .status(401)
        .json({ status: "error", code: 401, message: "Akun tidak ditemukan" });
    }

    res.status(200).json({
      status: "success",
      code: 200,
      message: "Login berhasil",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

const validateUpdateProfile = [
  body("name")
    .isString()
    .withMessage("Harap masukkan nama yang valid")
    .notEmpty()
    .withMessage("Nama tidak boleh kosong"),

  body("phone")
    .isNumeric()
    .withMessage("Nomor telepon harus berupa angka")
    .notEmpty()
    .withMessage("No. telepon tidak boleh kosong"),

  body("gender")
    .isString()
    .withMessage("Harap masukkan data yang valid")
    .notEmpty()
    .withMessage("Gender tidak boleh kosong"),
];

const update = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      status: "error",
      code: 400,
      errors: validationError(errors.array()),
    });
  }

  const { name, phone, gender } = matchedData(req);

  try {
    const user = await updateUserProfile(req.user.id, {
      name,
      phone,
      gender,
    });

    res.status(201).json({
      status: "success",
      code: 201,
      message: "Data berhasil diperbaharui",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  signup: [...validateSignup, signup],
  update: [...validateUpdateProfile, update],
  login: [...validateLogin, login],
};
