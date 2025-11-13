import React, { useState, useEffect } from 'react';
import axios from 'axios';
import LandingPage from './components/LandingPage';
import AuthPage from './components/AuthPage';
import Dashboard from './components/Dashboard';
import Courtroom from './components/Courtroom';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentView, setCurrentView] = useState('landing'); // 'landing', 'auth', 'dashboard', 'courtroom'
  const [selectedCaseId, setSelectedCaseId] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setUser({ name: localStorage.getItem('userName') || 'User' });
      setCurrentView('dashboard');
    }
    setLoading(false);
  }, []);

  const handleAuth = async (userData, isLogin) => {
    try {
      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
      const response = await axios.post(`http://localhost:5001${endpoint}`, userData);
      
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('userName', response.data.user?.name || userData.name);
      setUser({ name: response.data.user?.name || userData.name });
      setCurrentView('dashboard');
    } catch (error) {
      alert(error.response?.data?.error || 'Authentication failed');
    }
  };

  const handleShowAuth = () => {
    setCurrentView('auth');
  };

  const handleCreateCase = () => {
    setSelectedCaseId(null);
    setCurrentView('courtroom');
  };

  const handleSelectCase = (caseId) => {
    setSelectedCaseId(caseId);
    setCurrentView('courtroom');
  };

  const handleBackToDashboard = () => {
    setCurrentView('dashboard');
    setSelectedCaseId(null);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    setUser(null);
    setCurrentView('landing');
    setSelectedCaseId(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Render based on current view
  switch (currentView) {
    case 'auth':
      return <AuthPage onLogin={handleAuth} />;
    
    case 'dashboard':
      return (
        <Dashboard 
          user={user} 
          onLogout={handleLogout}
          onCreateCase={handleCreateCase}
          onSelectCase={handleSelectCase}
        />
      );
    
    case 'courtroom':
      return (
        <Courtroom 
          user={user} 
          onLogout={handleLogout}
          selectedCaseId={selectedCaseId}
          onBackToDashboard={handleBackToDashboard}
        />
      );
    
    default:
      return <LandingPage onShowAuth={handleShowAuth} />;
  }
}

export default App;