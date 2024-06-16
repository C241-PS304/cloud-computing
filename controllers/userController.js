const { body, validationResult, matchedData } = require("express-validator");
const {
  createUserAccount,
  updateUserProfile,
  loginUser,
  sendVerificationEmail,
  generateOtpCode,
} = require("../services/userService");
const {
  query,
  collection,
  where,
  getDocs,
  doc,
  setDoc,
  getDoc,
} = require("firebase/firestore");
const { db } = require("../config/firebase");
const { validationError } = require("../helpers/validationError");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const config = require("../config/config");

// === OTP CODE ===
let otpCode;

const validateSignup = [
  body("email")
    .custom(async (value) => {
      const q = query(collection(db, "users"), where("email", "==", value));
      const snapshot = await getDocs(q);

      if (!snapshot.empty) {
        throw new Error("Email sudah terdaftar");
      }

      return true;
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

  // body("passwordConfirmation")
  //   .custom((value, { req }) => {
  //     if (value !== req.body.password) {
  //       throw new Error("Password tidak sesuai");
  //     }

  //     return true;
  //   })
  //   .notEmpty()
  //   .withMessage("Konfirmasi password tidak boleh kosong"),
];

const signup = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      status: "error",
      errors: validationError(errors.array()),
    });
  }

  const { email, password } = matchedData(req);

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await createUserAccount(email, hashedPassword);

    // const code = generateOtpCode();
    // otpCode = code;

    // await sendVerificationEmail(email, code);

    const token = jwt.sign({ id: user.id }, config.jwtSecret, {
      expiresIn: "7d",
    });

    res.status(201).json({
      status: "success",
      message: "Registrasi berhasil",
      token,
      data: { id: user.id, user },
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
      errors: validationError(errors.array()),
    });
  }

  const { email, password } = matchedData(req);

  try {
    const user = await loginUser(email, password);

    if (!user) {
      return res
        .status(401)
        .json({ status: "error", message: "Akun tidak ditemukan" });
    }

    // if (!user.isVerified) {
    //   return res.status(401).json({
    //     status: "error",
    //     message: "Harap lakukan verifikasi terlebih dahulu",
    //     data: { id: user.id, email: user.email },
    //   });
    // }

    const token = jwt.sign({ id: user.id }, config.jwtSecret, {
      expiresIn: "7d",
    });

    res.status(200).json({
      status: "success",
      message: "Login berhasil",
      token,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

const user = (req, res, next) => {
  res.status(200).json({ status: "success", data: req.user });
};

const update = async (req, res, next) => {
  if ("password" in req.body) {
    req.body.password = await bcrypt.hash(req.body.password, 10);
  }

  try {
    const user = await updateUserProfile(req.user.id, req.body);

    res.status(201).json({
      status: "success",
      message: "Data berhasil diperbaharui",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

const validateOtp = [
  body("email")
    .isEmail()
    .withMessage("Masukkan email yang valid")
    .notEmpty()
    .withMessage("email tidak boleh kosong"),
];

const sendOtp = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      status: "error",
      errors: validationError(errors.array()),
    });
  }

  const code = generateOtpCode();
  otpCode = code;

  try {
    await sendVerificationEmail(matchedData(req).email, code);

    res.status(200).json({
      status: "success",
      message: "Kode OTP sudah dikirim ke email anda",
    });
  } catch (error) {
    next(error);
  }
};

const validateVerifyOtp = [
  body("id").notEmpty().withMessage("ID tidak boleh kosong"),

  body("otp")
    .isNumeric()
    .withMessage("Kode otp harus berupa angka")
    .notEmpty()
    .withMessage("Otp tidak boleh kosong"),
];

const verify = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      status: "error",
      errors: validationError(errors.array()),
    });
  }

  const { id, otp } = matchedData(req);

  if (otpCode !== +otp) {
    return res
      .status(400)
      .json({ status: "error", message: "Kode otp tidak sesuai" });
  }

  try {
    const docRef = doc(db, "users", id);
    await setDoc(docRef, { isVerified: true }, { merge: true });

    const token = jwt.sign({ id }, config.jwtSecret, { expiresIn: "1h" });

    const user = await getDoc(doc(db, "users", id));

    res.status(200).json({
      status: "success",
      message: "Akun berhasil di verifikasi",
      token,
      data: { id: user.id, ...user.data() },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  signup: [...validateSignup, signup],
  update,
  login: [...validateLogin, login],
  sendOtp: [...validateOtp, sendOtp],
  verify: [...validateVerifyOtp, verify],
  user,
};
