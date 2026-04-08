const express = require("express");
const router = express.Router();
const { createItem, getAllItems } = require("../controllers/itemController");
const auth = require("../middleware/auth");

router.post("/report", auth, createItem); // Only logged-in users can report
router.get("/all", getAllItems); // Everyone can see the feed

module.exports = router;
