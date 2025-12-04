
import {BrowserRouter as Router,Routes,Route} from "react-router-dom";
import './App.css'
import NavBar from './components/NavBar.jsx';
import Footer from './components/Footer.jsx';

import Home from './Pages/Home/Home.jsx';
import SkillSearch from './Pages/SkillSearch/Components/SkillSearch.jsx';
import SkillRequest from './Pages/SkillRequest/Components/SkillRequest.jsx';
import Community from './Pages/Community/Community.jsx';
import MessagePage from './Pages/Message/MessagePage.jsx';
import Profile from './Pages/Profile/Profile.jsx';
import FloatingChatButton from './components/FloatingChatButton.jsx';

function App() {

  return (
    <Router>      
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/skill-search" element={<SkillSearch />} />
        <Route path="/skill-request" element={<SkillRequest />} />
        <Route path="/community" element={<Community />} />
        <Route path="/chat" element={<MessagePage />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
      <FloatingChatButton />
    </Router>
  );
}

export default App
