const express = require("express");
const multer = require("multer");
const { v4: uuidv4 } = require("uuid");
const verifyToken = require("../utils/verifyFirebaseToken");
const cloudinary = require("../cloudinary");
const admin = require("../firebase");

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post("/upload", verifyToken, upload.single("image"), (req, res) => {
  const file = req.file;
  if (!file) {
    return res.status(400).json({ error: "No image uploaded" });
  }

  const stream = cloudinary.uploader.upload_stream(
    {
      folder: "album_app",
      public_id: uuidv4(),
      resource_type: "image",
    },
    async (error, result) => {
      if (error) {
        console.error(error);
        return res.status(500).json({ error: "Cloudinary upload failed" });
      }

      try {
        await admin.firestore().collection("albums").add({
          userId: req.user.uid,
          imageUrl: result.secure_url,
          publicId: result.public_id,
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
        });

        return res.status(200).json({
          message: "Image uploaded successfully",
          url: result.secure_url,
        });
      } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Failed to save to Firestore" });
      }
    }
  );

  stream.end(file.buffer);
});

module.exports = router;
