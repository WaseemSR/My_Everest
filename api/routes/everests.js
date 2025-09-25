const express = require("express");
const router = express.Router();

const EverestsController = require("../controllers/everests");
const tokenChecker = require("../middleware/tokenChecker");

//  All /everests routes are protected in app.js via tokenChecker
//  GET all Everests
router.get("/", EverestsController.getAllEverests);
router.patch("/:id", EverestsController.updateEverest);
router.get("/:id", EverestsController.getEverestById);
router.delete("/:id", EverestsController.deleteEverest);
router.patch("/:everestId/milestones/:milestoneId", EverestsController.checkbox);
router.post("/:everestId/milestones", EverestsController.addMilestone);


// POST create Everest with auth + file upload
router.post("/",EverestsController.createEverest);

module.exports = router;
