import "./App.css";
import { Routes, Route } from "react-router-dom";
import LandingPage from "./pages/landingPage/landingPage";
import Signup from "./pages/signup/signup";
import Login from "./pages/login/login";
import Dashboard from "./pages/dashboard/dashboard";
import Settings from "./pages/settings/settings";
import EditProfile from "./pages/editProfile/editProfile";
import EditProfileImage from "./pages/editProfileImage/editProfileImage";
import NotFound from "./pages/nofound/notFound";

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/settings" element={<Settings />} />
      <Route path="/settings/editprofile" element={<EditProfile/>}/>
      <Route path="/settings/editprofile/editprofileimage" element={<EditProfileImage />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}
export default App;