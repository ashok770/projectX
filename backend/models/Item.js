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
      enum: ["active", "matched", "resolved", "pending-pickup"],
      default: "active",
    },
    dropOffLocation: {
      type: String,
      required: false,
      enum: ["Security Gate", "CSE Dept Office", "Library Desk", "Library Front Desk", "Hostel Office"],
    },
    claimCode: {
      type: String,
      unique: true,
      sparse: true,
    },
    isReceivedByStaff: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Item", itemSchema);
