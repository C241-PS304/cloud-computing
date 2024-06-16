const { Router } = require("express");
const articleController = require("../controllers/articleController");

const articleRoutes = Router();

articleRoutes.get("/", articleController.index);
articleRoutes.get("/:id", articleController.show);

module.exports = articleRoutes;
