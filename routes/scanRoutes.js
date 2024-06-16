const { Router } = require("express");
const scanController = require("../controllers/scanController");

const scanRoutes = Router();

scanRoutes.post("/", scanController.store);
scanRoutes.get("/last", scanController.lastScan);
scanRoutes.delete("/:id", scanController.destroy);

module.exports = scanRoutes;
