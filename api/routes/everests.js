const express = require("express");
const router = express.Router();

const EverestsController = require("../controllers/everests");
const tokenChecker = require("../middleware/tokenChecker");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const uploadPath = path.join(__dirname, "..", "uploads");


//  Ensure the uploads directory exists
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

//  Configure Multer with absolute path
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const extension = path.extname(file.originalname); // includes the dot
    cb(null, `${file.fieldname}-${uniqueSuffix}${extension}`);
  },
});

const upload = multer({ storage });

//  GET all Everests
router.get("/", EverestsController.getAllEverests);
router.post("/", EverestsController.createEverest);
router.get("/:id", EverestsController.getEverestById);
router.delete("/:id", EverestsController.deleteEverest)
router.patch("/:everestId/milestones/:milestoneId", EverestsController.checkbox);
router.post("/:everestId/milestones", EverestsController.addMilestone)

// POST create Everest with auth + file upload
router.post(
  "/",
  tokenChecker,
  upload.single("photo"), // "photo" must match FormData field in frontend
  EverestsController.createEverest
);

module.exports = router;
