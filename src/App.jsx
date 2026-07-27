import './App.css';
import { Routes, Route, Navigate } from 'react-router-dom';
import Signup from './pages/signup/signup';
import Login from './pages/signup/login/login'; // Signup ke andar login folder ka path

function App() {
  return (
    <Routes>
      {/* Root (/) par automatic login par redirect */}
      <Route path='/' element={<Navigate to="/login" replace />} />

      {/* App Routes */}
      <Route path='/signup' element={<Signup />} />
      <Route path='/login' element={<Login />} />
    </Routes>
  );
}

export default App;