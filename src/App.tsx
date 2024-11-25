import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Blog from './pages/Blog';
import Help from './pages/Help';
import FAQ from './pages/FAQ';
import Contact from './pages/Contact';
import Demo from './pages/Demo';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Contacts from './pages/Contacts';
import CampaignSetup from './pages/CampaignSetup';
import TaskCreation from './pages/TaskCreation';
import CampaignPublish from './pages/CampaignPublish';
import CampaignEdit from './pages/CampaignEdit';
import PublicCampaignView from './pages/PublicCampaignView';
import Sidebar from './components/Sidebar';
import { useAuthStore } from './store/authStore';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

function ProtectedRoute({ children }: ProtectedRouteProps) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="flex min-h-screen pt-16">
      <Sidebar />
      <div className="flex-1 ml-64">
        {children}
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/help" element={<Help />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/demo" element={<Demo />} />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/contacts"
              element={
                <ProtectedRoute>
                  <Contacts />
                </ProtectedRoute>
              }
            />
            <Route
              path="/campaigns/new"
              element={
                <ProtectedRoute>
                  <CampaignSetup />
                </ProtectedRoute>
              }
            />
            <Route
              path="/campaigns/tasks"
              element={
                <ProtectedRoute>
                  <TaskCreation />
                </ProtectedRoute>
              }
            />
            <Route
              path="/campaigns/publish"
              element={
                <ProtectedRoute>
                  <CampaignPublish />
                </ProtectedRoute>
              }
            />
            <Route
              path="/campaigns/edit"
              element={
                <ProtectedRoute>
                  <CampaignEdit />
                </ProtectedRoute>
              }
            />
            <Route path="/campaign/:code" element={<PublicCampaignView />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}