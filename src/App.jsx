import './App.css';
import { Routes, Route } from 'react-router-dom';
// import { Link } from 'react-router-dom'
import Signup from './pages/signup/signup';
import NotFound from './pages/not-found/NotFound';

function App() {
  return (
   <>
    <Routes>
      <Route path='/signup' element={<Signup/>} /> 


      
      {/* error page */}
      <Route path='*' element={<NotFound/>} />
    </Routes>
   </>
    
  );
}

export default App;