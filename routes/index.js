const { Router } = require("express");
const userRoutes = require("./userRoutes");
const programRoutes = require("./programRoutes");
const authenticate = require("../middlewares/auth");
const scanRoutes = require("./scanRoutes");
const articleRoutes = require("./articleRoutes");

const router = Router();

router.use("/user", userRoutes);

router.use(authenticate);
router.use("/programs", programRoutes);
router.use("/scans", scanRoutes);
router.use("/articles", articleRoutes);

module.exports = router;
