const { Router } = require("express");
const programController = require("../controllers/programController");

const programRoutes = Router();

programRoutes.get("/", programController.index);
programRoutes.post("/", programController.store);
programRoutes.get("/:id", programController.show);
programRoutes.patch("/:id", programController.update);
programRoutes.patch("/:id/done", programController.setDone);
programRoutes.delete("/:id", programController.destroy);

module.exports = programRoutes;
