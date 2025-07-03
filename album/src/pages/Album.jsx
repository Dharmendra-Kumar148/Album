// ... other imports remain unchanged
import { useState, useEffect, useRef } from "react";
import { db } from "../firebase";
import {
  collection,
  addDoc,
  getDocs,
  serverTimestamp,
  updateDoc,
  doc,
  query,
  where,
} from "firebase/firestore";
import { useAuth } from "../context/AuthContext";
import { EllipsisVertical } from "lucide-react";

const Album = () => {
  const { user } = useAuth();
  const [image, setImage] = useState(null);
  const [caption, setCaption] = useState("");
  const [category, setCategory] = useState("");
  const [images, setImages] = useState([]);
  const [lightboxUrl, setLightboxUrl] = useState(null);
  const [filter, setFilter] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [activeMenu, setActiveMenu] = useState(null);
  const fileInputRef = useRef();
  const dropdownRef = useRef();

  const uploadImage = async () => {
    if (!image || !caption.trim()) {
      alert("Please select an image and enter a caption.");
      return;
    }

    try {
      setUploading(true);
      const token = await user.getIdToken();

      const formData = new FormData();
      formData.append("image", image);

      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/album/upload`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || "Upload failed");
      }

      await addDoc(collection(db, "albums"), {
        url: result.url,
        caption: caption.trim(),
        category: category.trim(),
        createdAt: serverTimestamp(),
        userId: user.uid,
        publicId: result.publicId, // store it in Firestore to link for deletion
      });

      alert("✅ Upload successful!");
      setImage(null);
      setCaption("");
      setCategory("");
      fileInputRef.current.value = "";
      await fetchImages();
    } catch (err) {
      console.error("Upload error:", err);
      alert("❌ Upload failed: " + err.message);
    } finally {
      setUploading(false);
    }
  };

  const fetchImages = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, "albums"), where("userId", "==", user.uid));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setImages(data.sort((a, b) => b.createdAt?.seconds - a.createdAt?.seconds));
    } catch (err) {
      console.error("Failed to fetch images:", err);
    }
    setLoading(false);
  };

  const deleteImage = async (docId) => {
    try {
      const token = await user.getIdToken();
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/album/${docId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || "Failed to delete image");
      }

      alert("🗑️ Image deleted successfully");
      await fetchImages();
    } catch (err) {
      console.error("Delete error:", err);
      alert("❌ Failed to delete image: " + err.message);
    }
  };

  const setAsProfilePhoto = async (url) => {
    try {
      await updateDoc(doc(db, "users", user.uid), {
        profilePhotoUrl: url,
        photoURL: url,
      });
      alert("✅ Profile photo updated!");
    } catch (error) {
      console.error("Failed to update profile photo:", error);
      alert("❌ Failed to update profile photo.");
    }
  };

  useEffect(() => {
    if (user) fetchImages();
  }, [user]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setActiveMenu(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredImages = filter
    ? images.filter((img) => img.category?.toLowerCase().includes(filter.toLowerCase()))
    : images;

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      {/* Upload Form */}
      <div className="bg-white p-4 rounded shadow max-w-2xl mx-auto mb-8">
        <h2 className="text-xl font-bold mb-4">📤 Upload Photo</h2>

        <div
          className="border-2 border-dashed border-gray-300 p-4 rounded mb-4 text-center cursor-pointer"
          onClick={() => fileInputRef.current.click()}
        >
          {image ? (
            <p className="text-green-600">✅ Selected: {image.name}</p>
          ) : (
            <p>📎 Click here or drag an image to select</p>
          )}
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            className="hidden"
            onChange={(e) => setImage(e.target.files[0])}
          />
        </div>

        <input
          type="text"
          placeholder="Caption"
          className="w-full p-2 border rounded mb-2 text-sm"
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
        />
        <input
          type="text"
          placeholder="Category (e.g. Vacation, Family)"
          className="w-full p-2 border rounded mb-4 text-sm"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />

        <button
          onClick={uploadImage}
          disabled={uploading}
          className={`w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded ${
            uploading && "opacity-50 cursor-not-allowed"
          }`}
        >
          {uploading ? "Uploading..." : "Upload"}
        </button>
      </div>

      {/* Filter */}
      <div className="max-w-4xl mx-auto mb-6">
        <input
          type="text"
          placeholder="🔍 Filter by category..."
          className="w-full p-2 rounded border text-sm"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          onKeyDown={(e) => e.key === "Escape" && setFilter("")}
        />
      </div>

      {/* Gallery */}
      {loading ? (
        <div className="text-center text-gray-500">Loading photos...</div>
      ) : filteredImages.length === 0 ? (
        <div className="text-center text-gray-500">
          📭 No photos found{filter ? ` in category "${filter}"` : ""}.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {filteredImages.map((img) => (
            <div key={img.id} className="bg-white rounded shadow p-2 relative">
              {img.url === user?.photoURL && (
                <span className="absolute top-2 left-2 bg-blue-600 text-white text-xs px-2 py-1 rounded">
                  ✅ Current
                </span>
              )}

              <img
                src={img.url}
                alt={img.caption}
                className="w-full rounded cursor-pointer"
                onClick={() => setLightboxUrl(img.url)}
              />

              {/* Menu */}
              <div className="absolute top-2 right-2 z-20" ref={dropdownRef}>
                <button
                  onClick={() => setActiveMenu(activeMenu === img.id ? null : img.id)}
                  className="p-1 rounded-full hover:bg-gray-200"
                >
                  <EllipsisVertical className="w-5 h-5" />
                </button>
                {activeMenu === img.id && (
                  <div className="absolute right-0 mt-2 w-40 bg-white border rounded shadow z-50">
                    <button
                      onClick={() => {
                        setAsProfilePhoto(img.url);
                        setActiveMenu(null);
                      }}
                      className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-sm"
                    >
                      📸 Set as Profile
                    </button>
                    <button
                      onClick={() => {
                        deleteImage(img.id);
                        setActiveMenu(null);
                      }}
                      className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-sm text-red-600"
                    >
                      ❌ Delete
                    </button>
                  </div>
                )}
              </div>

              <p className="text-sm text-gray-700 mt-2">{img.caption}</p>
              {img.category && (
                <span className="text-xs bg-gray-200 px-2 py-1 rounded mt-1 inline-block">
                  {img.category}
                </span>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Lightbox */}
      {lightboxUrl && (
        <div
          className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50"
          onClick={() => setLightboxUrl(null)}
        >
          <img
            src={lightboxUrl}
            alt="Preview"
            className="max-h-[90vh] max-w-[90vw] rounded shadow-lg"
          />
          <button
            onClick={() => setLightboxUrl(null)}
            className="absolute top-4 right-4 text-white text-3xl"
          >
            ✖
          </button>
        </div>
      )}
    </div>
  );
};

export default Album;
