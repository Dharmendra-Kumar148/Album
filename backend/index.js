// index.js

const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const albumRoutes = require("./routes/album");

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// ➕ Add this root route
app.get("/", (req, res) => {
  res.send("📦 Album backend is up and running!");
});

// Routes
app.use("/api/album", albumRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Backend running on http://localhost:${PORT}`));
