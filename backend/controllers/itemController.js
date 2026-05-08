const Item = require("../models/Item");
const User = require("../models/User");
const { getSemanticMatch } = require("../utils/aiEngine");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");

exports.createItem = async (req, res) => {
  try {
    const {
      type,
      itemName,
      category,
      description,
      location,
      image,
      secretQuestion,
      secretAnswer,
    } = req.body;

    const newItem = new Item({
      type,
      itemName,
      category,
      description,
      location,
      image,
      secretQuestion,
      secretAnswer: secretAnswer ? await bcrypt.hash(secretAnswer.toLowerCase().trim(), 10) : undefined,
      reportedBy: req.user.id,
    });

    await newItem.save();
    res
      .status(201)
      .json({ message: "Item reported successfully!", item: newItem });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAllItems = async (req, res) => {
  try {
    const items = await Item.find()
      .sort({ createdAt: -1 })
      .populate("reportedBy", "name trustScore");
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
exports.verifyClaim = async (req, res) => {
  try {
    const { itemId, answer } = req.body;
    const item = await Item.findById(itemId).select("+secretAnswer +claimAttempts +claimLockedUntil");

    if (!item) return res.status(404).json({ message: "Item not found" });
    if (!item.secretAnswer) return res.status(400).json({ message: "This item has no secret answer set." });

    // Brute-force lock check
    if (item.claimLockedUntil && item.claimLockedUntil > Date.now()) {
      const mins = Math.ceil((item.claimLockedUntil - Date.now()) / 60000);
      return res.status(429).json({ message: `Too many attempts. Try again in ${mins} minute(s).` });
    }

    const isMatch = await bcrypt.compare(answer.toLowerCase().trim(), item.secretAnswer);

    if (isMatch) {
      const rawCode = crypto.randomInt(100000, 999999).toString();
      const hashedCode = await bcrypt.hash(rawCode, 10);

      item.status = "pending-pickup";
      item.claimCode = hashedCode;
      item.claimCodeExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24h expiry
      item.claimAttempts = 0;
      item.claimLockedUntil = null;
      await item.save();

      res.json({
        success: true,
        message: "Identity Verified!",
        claimCode: rawCode,
        dropOffLocation: item.dropOffLocation || "College Office",
      });
    } else {
      item.claimAttempts = (item.claimAttempts || 0) + 1;
      if (item.claimAttempts >= 5) {
        item.claimLockedUntil = new Date(Date.now() + 15 * 60 * 1000); // lock 15 mins
        item.claimAttempts = 0;
      }
      await item.save();
      res.status(400).json({ message: "Wrong answer, try again!" });
    }
  } catch (err) {
    console.error("verifyClaim error:", err.message);
    res.status(500).json({ error: err.message });
  }
};
exports.getSmartMatches = async (req, res) => {
  try {
    const myLostItems = await Item.find({ reportedBy: req.user.id, type: "lost", status: "active" });
    const allFoundItems = await Item.find({ type: "found", status: "active" });

    let aiSuggestions = [];

    for (let lost of myLostItems) {
      for (let found of allFoundItems) {
        if (lost.category === found.category) {
          const matchResult = await getSemanticMatch(lost, found);

          if (matchResult.score > 70) {
            aiSuggestions.push({
              ...found._doc,
              aiConfidence: matchResult.score,
              aiReason: matchResult.reason,
            });
          }
        }
      }
    }

    res.json(aiSuggestions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
exports.getUserItems = async (req, res) => {
  try {
    // req.user.id comes from our Auth Middleware
    const items = await Item.find({ reportedBy: req.user.id }).sort({
      createdAt: -1,
    });
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
exports.getMatchesForUser = async (req, res) => {
  try {
    // 1. Get all lost items by this user
    const myLostItems = await Item.find({
      reportedBy: req.user.id,
      type: "lost",
      status: "active",
    });

    // 2. Find found items that match the category of my lost items
    const categories = myLostItems.map((item) => item.category);
    const potentialMatches = await Item.find({
      type: "found",
      category: { $in: categories },
      status: "active",
    }).populate("reportedBy", "name trustScore");

    res.json(potentialMatches);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
exports.deleteItem = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Item not found" });

    if (item.reportedBy.toString() !== req.user.id)
      return res.status(403).json({ message: "Not authorized" });

    await item.deleteOne();
    res.json({ message: "Item deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateItem = async (req, res) => {
  try {
    let item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Item not found" });

    if (item.reportedBy.toString() !== req.user.id)
      return res.status(401).json({ message: "Unauthorized" });

    item = await Item.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
