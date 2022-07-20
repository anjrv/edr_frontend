import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Data from './pages/Data';
import Info from './pages/Info';
import Nav from './Nav';

function App() {
  return (
    <div className='App'>
      <Router>
        <Nav />
        <Routes>
          <Route exact path='/' element={<Data />} />
          <Route exact path='/info' element={<Info />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
