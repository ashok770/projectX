const Item = require("../models/Item");
const User = require("../models/User");

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
      secretAnswer,
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
    const item = await Item.findById(itemId).select("+secretAnswer");

    if (!item) return res.status(404).json({ message: "Item not found" });

    if (
      answer.toLowerCase().trim() === item.secretAnswer.toLowerCase().trim()
    ) {
      // 1. Reward the Finder (+10 points)
      await User.findByIdAndUpdate(item.reportedBy, {
        $inc: { trustScore: 10 },
      });

      // 2. Reward the Owner (+5 points)
      await User.findByIdAndUpdate(req.user.id, { $inc: { trustScore: 5 } });

      // 3. Mark item as resolved so it disappears from 'Active' feed
      item.status = "resolved";
      await item.save();

      res.json({
        success: true,
        message: "Verification Successful!",
        contact: "Contact Finder at: 9876543210",
      });
    } else {
      res.status(400).json({ success: false, message: "Incorrect answer." });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
exports.getSmartMatches = async (req, res) => {
  try {
    // 1. Get all "Lost" items reported by the current user
    const myLostItems = await Item.find({
      reportedBy: req.user.id,
      type: "lost",
      status: "active",
    });

    let allSuggestions = [];

    for (let lostItem of myLostItems) {
      // 2. Find "Found" items in the same category
      const potentialFoundItems = await Item.find({
        type: "found",
        category: lostItem.category,
        status: "active",
      });

      // 3. Score them
      const scored = potentialFoundItems.map((found) => {
        let score = 0;
        if (found.location.toLowerCase() === lostItem.location.toLowerCase())
          score += 40;
        if (
          found.itemName.toLowerCase().includes(lostItem.itemName.toLowerCase())
        )
          score += 60;

        return { ...found._doc, matchScore: score };
      });

      // 4. Only keep items with a score > 40%
      allSuggestions.push(...scored.filter((s) => s.matchScore > 40));
    }

    res.json(allSuggestions);
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
