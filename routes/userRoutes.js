const { Router } = require("express");
const userController = require("../controllers/userController");
const authenticate = require("../middlewares/auth");

const userRoutes = Router();

// Authentication
userRoutes.post("/signup", userController.signup);
userRoutes.post("/login", userController.login);
userRoutes.post("/otp", userController.sendOtp);
userRoutes.post("/verify", userController.verify);

// User
userRoutes.get("/", authenticate, userController.user);
userRoutes.patch("/update", authenticate, userController.update);

module.exports = userRoutes;
