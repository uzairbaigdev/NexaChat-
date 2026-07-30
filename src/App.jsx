<<<<<<< HEAD
import "./App.css";
import { Routes, Route } from "react-router-dom";

import LandingPage from "./pages/landingPage/landingPage";
import Signup from "./pages/signup/signup";
import Login from "./pages/login/login";
import Dashboard from "./pages/dashboard/dashboard";
import Settings from "./pages/settings/settings";
import NotFound from "./pages/nofound/notFound";

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/settings" element={<Settings />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
=======
import './App.css';
// import { Routes, Route } from 'react-router-dom';
// import { Link } from 'react-router-dom'
import Signup from './pages/signup/signup';

function App() {
  return (
   <>
    <Signup/>
   </>
    
>>>>>>> 2da82d8a55cbd76923c0d38aa93f49f00bb266cb
  );
}

export default App;