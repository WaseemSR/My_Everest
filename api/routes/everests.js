const express = require("express");
const router = express.Router();

const EverestsController = require("../controllers/everest");

router.get("/", EverestsController.getAllEverests);
router.post("/", EverestsController.createEverest);
router.get("/:id", EverestsController.getEverestById);


module.exports = router;
