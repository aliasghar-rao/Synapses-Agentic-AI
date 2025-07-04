import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import HomePage from './pages/HomePage';
import TemplatePage from './pages/TemplatePage';
import QuestionnairePage from './pages/QuestionnairePage';
import PromptPage from './pages/PromptPage';
import SavedPromptsPage from './pages/SavedPromptsPage';
import CameraInputPage from './pages/CameraInputPage';
import Navbar from './components/Navbar';
import OfflineStatusBar from './components/OfflineStatusBar';

function App() {
  return (
    <AppProvider>
      <Router>
        <div className="min-h-screen bg-background grid-background pb-10">
          <Navbar />
          <div className="container mx-auto px-4 py-8">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/camera" element={<CameraInputPage />} />
              <Route path="/templates" element={<TemplatePage />} />
              <Route path="/questionnaire/:templateId" element={<QuestionnairePage />} />
              <Route path="/prompt" element={<PromptPage />} />
              <Route path="/saved-prompts" element={<SavedPromptsPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
          <OfflineStatusBar />
        </div>
      </Router>
    </AppProvider>
  );
}

export default App;
