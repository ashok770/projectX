const Item = require("../models/Item");

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
    } = req.body;

    const newItem = new Item({
      type,
      itemName,
      category,
      description,
      location,
      image,
      secretQuestion,
      reportedBy: req.user.id, // Taken from our Auth Middleware!
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

    // We fetch the item and explicitly ask for the 'secretAnswer'
    // because we set 'select: false' in the model earlier
    const item = await Item.findById(itemId).select("+secretAnswer");

    if (!item) return res.status(404).json({ message: "Item not found" });

    // Simple string match (You can make this 'Fuzzy' later with AI)
    if (
      answer.toLowerCase().trim() === item.secretAnswer.toLowerCase().trim()
    ) {
      // In a real app, you'd return the Finder's phone/email here
      res.json({
        success: true,
        message: "Verification Successful!",
        contact: "Contact Finder at: 9876543210",
      });
    } else {
      res
        .status(400)
        .json({ success: false, message: "Incorrect answer. Try again!" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
