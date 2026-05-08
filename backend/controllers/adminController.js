const Item = require("../models/Item");
const User = require("../models/User");
const bcrypt = require("bcryptjs");

exports.completeHandover = async (req, res) => {
  try {
    const { claimCode } = req.body;

    // Find all pending-pickup items and bcrypt.compare against each
    const pendingItems = await Item.find({ status: "pending-pickup" }).select("+claimCode claimCodeExpiry itemName reportedBy status");

    let matchedItem = null;
    for (const item of pendingItems) {
      if (!item.claimCode) continue;

      // Support both hashed (new) and plain text (legacy) codes
      let isMatch = false;
      if (item.claimCode.startsWith("$2")) {
        isMatch = await bcrypt.compare(claimCode, item.claimCode);
      } else {
        isMatch = item.claimCode === claimCode;
      }

      if (isMatch) {
        matchedItem = item;
        break;
      }
    }

    if (!matchedItem) {
      return res.status(404).json({ message: "Invalid Claim Code or item not found." });
    }

    // Check expiry
    if (matchedItem.claimCodeExpiry && matchedItem.claimCodeExpiry < Date.now()) {
      matchedItem.status = "active";
      matchedItem.claimCode = null;
      matchedItem.claimCodeExpiry = null;
      await matchedItem.save();
      return res.status(400).json({ message: "Claim code has expired. Student must re-verify." });
    }

    matchedItem.status = "resolved";
    matchedItem.claimCode = null;
    matchedItem.claimCodeExpiry = null;
    await matchedItem.save();

    await User.findByIdAndUpdate(matchedItem.reportedBy, { $inc: { trustScore: 20 } });

    res.json({
      success: true,
      message: "Handover Successful!",
      itemName: matchedItem.itemName,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
