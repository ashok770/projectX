const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const authRoutes = require("./routes/authRoutes");

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // Lets us handle JSON data
app.use("/api/auth", authRoutes);

// Basic Route for Testing
app.get("/", (req, res) => {
  res.send("Campus Retrieve API is running... 🚀");
});

// Database Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.log("❌ DB Connection Error:", err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`📡 Server running on http://localhost:${PORT}`);
});
