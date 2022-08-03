import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Data from './pages/Data';
import Android from './pages/Android';
import About from './pages/About';
import Nav from './components/Nav';

function App() {
  return (
    <div className='App'>
      <Router>
        <Nav />
        <Routes>
          <Route exact path='/' element={<Data />} />
          <Route exact path='/android' element={<Android />} />
          <Route exact path='/about' element={<About />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
