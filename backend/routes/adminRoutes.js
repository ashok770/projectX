const express = require("express");
const router = express.Router();
const { auth, isAdmin } = require("../middleware/auth");
const { completeHandover } = require("../controllers/adminController");

// Only authenticated Admins can hit this
router.post("/complete-handover", auth, isAdmin, completeHandover);

module.exports = router;
