import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { auth, db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import AppBar from "../components/AppBar";
import Sidebar from "../components/Sidebar";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const handleLogout = () => auth.signOut();

  useEffect(() => {
    const fetchProfile = async () => {
      if (user) {
        try {
          const docRef = doc(db, "users", user.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setProfile(docSnap.data());
          } else {
            console.warn("No profile data found.");
          }
        } catch (error) {
          console.error("Error fetching profile:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchProfile();
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Loading profile...</p>
      </div>
    );
  }

  const avatarUrl = profile?.profilePhotoUrl || "/default_avatar.png";

  return (
    <div className="min-h-screen bg-gray-100">
      <AppBar toggleSidebar={toggleSidebar} handleLogout={handleLogout} />
      <Sidebar
        isOpen={sidebarOpen}
        user={user}
        profileImage={avatarUrl}
        toggleSlidebar={toggleSidebar}
      />

      <main className="pt-20 px-6 ml-0 md:ml-64 transition-all duration-300">
        <div className="max-w-4xl mx-auto bg-white shadow p-6 rounded flex flex-col md:flex-row gap-6">
          <div className="flex-shrink-0">
            <img
              src={avatarUrl}
              alt="Avatar"
              className="w-40 h-40 rounded-full border shadow object-cover"
            />
          </div>

          <div className="flex-grow">
            <h2 className="text-2xl font-bold mb-4">{profile?.name || "Unnamed User"}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-700 text-sm">
              <p><strong>Email:</strong> {user?.email}</p>
              <p><strong>UID:</strong> {user?.uid}</p>
              <p><strong>Age:</strong> {profile?.age || "N/A"}</p>
              <p><strong>Gender:</strong> {profile?.gender || "N/A"}</p>
              <p><strong>Height:</strong> {profile?.height || "N/A"}</p>
              <p><strong>Weight:</strong> {profile?.weight || "N/A"}</p>
              <p><strong>Hobbies:</strong> {profile?.hobbies || "N/A"}</p>
              <p><strong>Interests:</strong> {profile?.interests || "N/A"}</p>
              <p><strong>Likes:</strong> {profile?.likes || "N/A"}</p>
              <p><strong>Dislikes:</strong> {profile?.dislikes || "N/A"}</p>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => navigate("/edit-profile")}
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                ✏️ Edit Profile
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;
