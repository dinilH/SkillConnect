
import {BrowserRouter as Router,Routes,Route} from "react-router-dom";
import './App.css'
import NavBar from './components/NavBar.jsx';
import Footer from './components/Footer.jsx';
import MassagePage from './Pages/Massage/MassagePage.jsx';

import Home from './Pages/Home.jsx';
import SkillSearch from './Pages/SkillSearch.jsx';
import SkillRequest from './Pages/SkillRequest.jsx';
import Community from './Pages/Community.jsx';

function App() {

  return (
    <Router>
      <NavBar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/skill-search" element={<SkillSearch />} />
        <Route path="/skill-request" element={<SkillRequest />} />
        <Route path="/community" element={<Community />} />
      </Routes>
    </Router>
  );
}

export default App
