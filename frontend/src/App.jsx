import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.css';
import FloatingChatButton from './components/FloatingChatButton.jsx';
import FloatingCalculatorButton from './components/FloatingCalculatorButton.jsx';
import { ChatProvider } from './Pages/Message/ChatContext.jsx';
import LoginPage from './Pages/Login/LoginForm.jsx';
import Home from './Pages/Home/Home.jsx';
import Dashboard from './Pages/Dashboard/Dashboard.jsx';
import SkillSearch from './Pages/SkillSearch/Components/SkillSearch.jsx';
import SkillRequest from './Pages/SkillRequest/Components/SkillRequest.jsx';
import Community from './Pages/Community/Community.jsx';
import Profile from './Pages/Profile/Profile.jsx';
import Signup from './Pages/Signup/CreateAccountForm.jsx';
import AuthModal from './components/AuthModal.jsx';
import OnboardingGate from './components/OnboardingGate.jsx';
import Profileown from "./Pages/Profile/ProfileOwnerView.jsx";
import ProfileViewerView from "./Pages/Profile/ProfileViewerView.jsx";
import { useActivityTracker } from './useActivityTracker';
import { FeatureDialogProvider, useFeatureDialog } from './FeatureDialogContext.jsx';
import FeaturePromptDialog from './components/FeaturePromptDialog.jsx';

function App() {
    // Track user activity
    useActivityTracker();

    return (
        <FeatureDialogProvider>
            <ChatProvider>
                <Router>
                    <Routes>
                        {/*<Route path="/" element={<Profile />} />*/}
                        <Route path="/" element={<Home />} />
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/skill-search" element={<SkillSearch />} />
                        <Route path="/skill-request" element={<SkillRequest />} />
                        <Route path="/community" element={<Community />} />
                        {/*<Route path="/profile" element={<Profile />} />*/}
                        <Route path="/signup" element={<Signup />} />
                        <Route path="/signin" element={<LoginPage />} />
                        <Route path="/profile" element={<Profileown />} />
                        <Route path="/profile/:userId" element={<ProfileViewerView />} />
                    </Routes>

                    <ConditionalFloatingButtons />
                    <FloatingCalculatorButton />
                    
                    {/* Global Auth Modal */}
                    <AuthModal />
                    {/* Skills Onboarding Gate */}
                    <OnboardingGate />
                    {/* Feature Dialog */}
                    <AppFeatureDialog />
                </Router>
            </ChatProvider>
        </FeatureDialogProvider>
    );
}

function AppFeatureDialog() {
    const { featureDialog, closeFeatureDialog } = useFeatureDialog();
    return (
        <FeaturePromptDialog
            isOpen={featureDialog.isOpen}
            onClose={closeFeatureDialog}
            featureName={featureDialog.feature}
        />
    );
}

function ConditionalFloatingButtons() {
    const location = window.location;
    // Don't show on home page
    if (location.pathname === '/') return null;
    return <FloatingChatButton />;
}

export default App;
