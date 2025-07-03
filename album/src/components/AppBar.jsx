const AppBar = ({ toggleSidebar, isSidebarOpen, handleLogout }) => (
  <header className="flex justify-between items-center bg-blue-600 text-white px-4 py-3 shadow fixed top-0 left-0 right-0 z-50">
    <button onClick={toggleSidebar} className="text-white text-2xl font-bold z-50">
      ☰
    </button>
    <h1 className="text-lg md:text-xl font-semibold">📔 My Album</h1>
    <button
      onClick={handleLogout}
      className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded text-sm"
    >
      Logout
    </button>
  </header>
);

export default AppBar;
