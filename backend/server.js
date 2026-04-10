const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const authRoutes = require("./routes/authRoutes");
const itemRoutes = require("./routes/itemRoutes");

dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: [
    "http://localhost:5173",
    process.env.FRONTEND_URL // Add your Vercel URL in .env
  ],
  credentials: true
}));
app.use(express.json()); // Lets us handle JSON data
app.use("/api/auth", authRoutes);
app.use("/api/items", itemRoutes);
app.use("/api/admin", require("./routes/adminRoutes"));

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
