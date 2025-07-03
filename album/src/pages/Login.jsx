import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
// import LandingPage from "./LandingPage";


const Login = ()=> { 

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleLogin =async (e) => {
        e.preventDefault();
        try {
            await signInWithEmailAndPassword(auth, email, password);
            navigate("/home");
        } catch (error) {
            alert(error.message);
        }
    };

    return(

            <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <form onSubmit={handleLogin} className="bg-white p-6 rounded shadow-md w-full max-w-sm" >
                <h2 className="text-xl font-bold mb-4">Sign In</h2>
                <input type="email" placeholder="Email" className="mb-4 w-full border p-2" value={email} onChange={(e)=> setEmail(e.target.value)} />
                <input type="password" placeholder="Password" className="mb-4 w-full border p-2" value={password} onChange={(e)=> setPassword(e.target.value)} />
                <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded">Login</button>
            </form>
        </div>

        
    );
};

export default Login;