import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { db } from "../firebase";
import {
  doc,
  getDoc,
  setDoc,
  collection,
  serverTimestamp,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const EditProfile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState({
    name: "",
    age: "",
    gender: "",
    height: "",
    weight: "",
    hobbies: "",
    interests: "",
    likes: "",
    dislikes: "",
    photoURL: "",
  });

  const [selectedImage, setSelectedImage] = useState(null);
  const [previewURL, setPreviewURL] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.body.style.overflow = "auto";
    return () => {
      document.body.style.overflow = "auto";
      if (previewURL) URL.revokeObjectURL(previewURL);
    };
  }, [previewURL]);

  useEffect(() => {
    if (!user) return;
    const fetchProfile = async () => {
      try {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setProfile((prev) => ({ ...prev, ...data }));
          setPreviewURL(data.photoURL || data.profilePhotoUrl || "/default_avatar.png");
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [user]);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      setPreviewURL(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let photoURL = profile.photoURL;

    try {
      if (selectedImage) {
        const token = await user.getIdToken();
        const formData = new FormData();
        formData.append("image", selectedImage);
        formData.append("caption", "Profile Photo");
        formData.append("category", "Profile");

        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/album/upload`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        });

        const result = await response.json();
        if (!response.ok) throw new Error(result.error || "Upload failed");

        photoURL = result.url;
      }

      await setDoc(
        doc(db, "users", user.uid),
        {
          ...profile,
          photoURL,
          profilePhotoUrl: photoURL,
        },
        { merge: true }
      );

      alert("✅ Profile updated!");
      navigate("/home");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error) {
      console.error("Update error:", error);
      alert("❌ Failed to update profile: " + error.message);
    }
  };

  if (loading) return <div className="text-center p-10">Loading profile...</div>;

  return (
    <div className="min-h-screen overflow-y-auto flex items-center justify-center bg-gray-100 px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow-md w-full max-w-lg space-y-4"
      >
        <h2 className="text-2xl font-bold text-center mb-4">✏️ Edit Profile</h2>

        {/* Profile Photo */}
        <div className="flex flex-col items-center">
          <img
            src={previewURL || "/default_avatar.png"}
            alt="Avatar"
            className="w-32 h-32 rounded-full border shadow object-cover mb-2"
          />
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="text-sm"
          />
        </div>

        {/* Profile Fields */}
        {[
          "name", "age", "gender", "height", "weight",
          "hobbies", "interests", "likes", "dislikes",
        ].map((field) => (
          <input
            key={field}
            type="text"
            name={field}
            placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
            value={profile[field]}
            onChange={handleChange}
            className="w-full border p-2 rounded text-sm"
          />
        ))}

        <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded font-medium">
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default EditProfile;
