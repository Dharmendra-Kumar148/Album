import LandingPage from './pages/LandingPage';
import Home from './pages/Home';
import Signup from './pages/Signup';
import Login from './pages/Login';
import EditProfile from './pages/EditProfile';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import Album from './pages/Album';



function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route path='/' element={<LandingPage />} />
      <Route path='/home' element={<ProtectedRoute>
        <Home />
      </ProtectedRoute>} />
      <Route path='/signup' element= {<Signup />} />
      <Route path='/login' element= {<Login />} />
      <Route path="/edit-profile" element={
       <ProtectedRoute>
       <EditProfile />
       </ProtectedRoute>} />
       <Route path='/album' element={<ProtectedRoute><Album /></ProtectedRoute>} />
    </Routes>
    </BrowserRouter>
  );
}

export default App
