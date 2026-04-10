const Item = require("../models/Item");
const User = require("../models/User");

exports.completeHandover = async (req, res) => {
  try {
    const { claimCode } = req.body;

    // Find the item that has this unique 6-digit code
    const item = await Item.findOne({ claimCode, status: "pending-pickup" });

    if (!item) {
      return res
        .status(404)
        .json({ message: "Invalid Claim Code or item not found." });
    }

    // 1. Mark as fully resolved
    item.status = "resolved";
    item.claimCode = null; // Clear the code after use
    await item.save();

    // 2. Reward the Finder (since the staff has now physically handed it over)
    await User.findByIdAndUpdate(item.reportedBy, { $inc: { trustScore: 20 } });

    res.json({
      success: true,
      message: "Handover Successful!",
      itemName: item.itemName,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
