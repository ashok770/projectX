const express = require("express");
const router = express.Router();
const {
  createItem,
  getAllItems,
  verifyClaim,
  getSmartMatches,
  getUserItems,
  getMatchesForUser,
  deleteItem,
  updateItem,
} = require("../controllers/itemController");
const { auth } = require("../middleware/auth");

router.post("/report", auth, createItem); // Only logged-in users can report
router.get("/all", getAllItems); // Everyone can see the feed
router.post("/verify-claim", auth, verifyClaim);
router.get("/smart-matches", auth, getSmartMatches);
router.get("/my-items", auth, getUserItems);
router.get("/matches", auth, getMatchesForUser);
router.delete("/:id", auth, deleteItem);
router.put("/:id", auth, updateItem);
module.exports = router;
