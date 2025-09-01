const express = require("express");
const router = express.Router();

const EverestsController = require("../controllers/everests");

router.get("/", EverestsController.getAllEverests);
router.post("/", EverestsController.createEverest);


module.exports = router;
