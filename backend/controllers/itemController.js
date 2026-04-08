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
