// index.js

const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const albumRoutes = require("./routes/album");

dotenv.config();
const app = express();

// ✅ Configure CORS for local + Vercel frontend
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://album-woad.vercel.app/", // ✅ Replace with your actual Vercel frontend domain
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(express.json());

// ➕ Add this root route
app.get("/", (req, res) => {
  res.send("📦 Album backend is up and running!");
});

// Routes
app.use("/api/album", albumRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Backend running on http://localhost:${PORT}`));
