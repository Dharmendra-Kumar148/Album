const express = require("express");
const multer = require("multer");
const { v4: uuidv4 } = require("uuid");
const verifyToken = require("../utils/verifyFirebaseToken");
const cloudinary = require("../cloudinary");
const admin = require("../firebase");

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// ✅ UPLOAD ROUTE
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
          publicId: result.public_id,
        });
      } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Failed to save to Firestore" });
      }
    }
  );

  stream.end(file.buffer);
});

// ✅ DELETE ROUTE with Profile Cleanup
router.delete("/:id", verifyToken, async (req, res) => {
  const { id } = req.params;

  try {
    const docRef = admin.firestore().collection("albums").doc(id);
    const docSnap = await docRef.get();

    if (!docSnap.exists) {
      return res.status(404).json({ error: "Image not found" });
    }

    const data = docSnap.data();

    // 🚫 Only allow deletion by owner
    if (data.userId !== req.user.uid) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    // 🗑️ Delete from Cloudinary
    if (data.publicId) {
      await cloudinary.uploader.destroy(data.publicId);
    }

    // 🔥 Delete Firestore document
    await docRef.delete();

    // 🧹 Remove references in user's profile if needed
    const userDocRef = admin.firestore().collection("users").doc(data.userId);
    const userDoc = await userDocRef.get();

    if (userDoc.exists) {
      const userData = userDoc.data();
      const updates = {};

      if (userData.photoURL === data.imageUrl) updates.photoURL = "";
      if (userData.profilePhotoUrl === data.imageUrl) updates.profilePhotoUrl = "";

      if (Object.keys(updates).length > 0) {
        await userDocRef.update(updates);
      }
    }

    return res.status(200).json({ message: "Image deleted successfully" });
  } catch (err) {
    console.error("Delete error:", err);
    return res.status(500).json({ error: "Failed to delete image" });
  }
});

module.exports = router;
