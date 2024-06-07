const { Router } = require("express");
const userController = require("../controllers/userController");
const authenticate = require("../middlewares/auth");

const userRoutes = Router();

// Authentication
userRoutes.post("/signup", userController.signup);
userRoutes.post("/login", userController.login);

// User
userRoutes.patch("/update", authenticate, userController.update);

module.exports = userRoutes;
