import './App.css';
// import { Routes, Route } from 'react-router-dom';
// import { Link } from 'react-router-dom'
import Signup from './pages/signup/signup';
import Dashboard from './pages/dashboard/dashboard';
import Settings from './pages/settings/settings';
import { Route,Routes } from "react-router-dom";

function App() {
  return (
   <>
     <Routes>
      <Route path='/' element={<h1>App.jsx</h1> } />
      <Route path='/signup' element={<Signup/>}/>
      <Route path='/dashboard' element={<Dashboard/>} />
      <Route path='/settings' element={<Settings/>} />
     </Routes>
   </>
    
  );
}

export default App;