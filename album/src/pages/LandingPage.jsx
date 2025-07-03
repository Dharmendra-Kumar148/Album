import { Link } from "react-router-dom";
// import AnimatedPage from "../components/AnimatedPage";


const LandingPage = () => {
  return(

        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 text-center p-10">
      <h1 className="text-4xl font-bold mb-4">📔 Digital Photo Album</h1>
      <p className="mb-6 text-gray-700 max-w-xl">Relive your memories like old photo albums — beautifully preserved online.</p>
      <div className="space-x-4">
        <Link to="/signup" >
        <button className="bg-blue-500 text-white px-4 py-2 rounded">
          Sign Up
        </button>
        </Link>
        <Link to="/login" >
        <button className="bg-gray-700 text-white px-4 py-2 rounded">Login</button>
        </Link>
      </div>
    </div>

    
  );
};

export default LandingPage;