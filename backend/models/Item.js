const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema(
  {
    type: { type: String, enum: ["lost", "found"], required: true },
    itemName: { type: String, required: true },
    category: { type: String, required: true },
    description: { type: String, required: true },
    location: { type: String, required: true },
    image: { type: String }, // This will be the Cloudinary URL
    secretQuestion: { type: String },
    secretAnswer: { type: String, select: false },
    reportedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["active", "matched", "resolved"],
      default: "active",
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Item", itemSchema);
