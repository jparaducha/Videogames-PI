import './App.css';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Home from './components/Home';
import Landing from './components/Landing'
import Cards from './components/Cards';
import Card from './components/Card';
import Nav from './components/Nav';
import CreateGame from './components/CreateGame';
import store from './store';

function App() {
  return (
    <BrowserRouter>
    
    <Routes>
      <Route path='/' element={<Landing/>}/>
      <Route path='/games' element={<Home/>}/>
      <Route path='/form' element={<CreateGame/>}/>
    </Routes> 
    </BrowserRouter>
  );
}

export default App;
