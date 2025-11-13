import React, { useState, useEffect } from 'react';
import axios from 'axios';
import io from 'socket.io-client';
import SidePanel from './SidePanel';
import JudgePanel from './JudgePanel';
import Toast from './Toast';

const socket = io('http://localhost:5001');

const Courtroom = ({ user, onLogout, selectedCaseId, onBackToDashboard }) => {
  const [caseId, setCaseId] = useState(selectedCaseId || '');
  const [currentCase, setCurrentCase] = useState(null);
  const [aiDecisions, setAiDecisions] = useState([]);
  const [argumentCount, setArgumentCount] = useState(0);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  useEffect(() => {
    socket.on('aiDecision', (decision) => {
      console.log('📨 Received AI decision via socket:', decision);
      setAiDecisions(prev => [...prev, decision]);
    });

    socket.on('newArgument', (data) => {
      setArgumentCount(data.count);
      showToast('Argument submitted successfully!');
      loadCase();
    });

    socket.on('documentUploaded', (data) => {
      showToast(`Documents uploaded for ${data.side}!`);
      loadCase();
    });

    return () => socket.disconnect();
  }, []);

  // Join case room when caseId changes
  useEffect(() => {
    if (caseId) {
      socket.emit('joinCase', caseId);
      console.log('🔗 Joined case room:', caseId);
      loadCase(caseId);
    }
  }, [caseId]);

  // Load existing case if selectedCaseId is provided
  useEffect(() => {
    if (selectedCaseId) {
      setCaseId(selectedCaseId);
    }
  }, [selectedCaseId]);

  const createCase = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('http://localhost:5001/api/cases', {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const newCaseId = response.data.caseId;
      setCaseId(newCaseId);
      socket.emit('joinCase', newCaseId);
      loadCase(newCaseId);
    } catch (error) {
      showToast('Error creating case: ' + error.message, 'error');
    }
  };

  const loadCase = async (id = caseId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:5001/api/cases/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCurrentCase(response.data);
      setAiDecisions(response.data.aiDecisions);
      setArgumentCount(response.data.argumentCount);
    } catch (error) {
      console.error('Error loading case:', error);
    }
  };

  const requestJudgment = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`http://localhost:5001/api/cases/${caseId}/judge`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Update aiDecisions immediately with the response
      if (response.data) {
        setAiDecisions(prev => [...prev, response.data]);
        showToast('AI Judgment delivered!');
        // Also reload the case to ensure consistency
        loadCase();
      }
    } catch (error) {
      showToast('Error requesting judgment: ' + error.message, 'error');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      
      <header className="bg-white/90 backdrop-blur-md shadow-sm border-b border-gray-100 p-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
              <span className="text-white text-xl">⚖️</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-800">
              AI Judge System
            </h1>
          </div>
          
          {!caseId ? (
            <button
              onClick={createCase}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
            >
              Create New Case
            </button>
          ) : (
            <div className="flex items-center space-x-6">
              <div className="bg-white border border-gray-200 rounded-lg px-4 py-2 shadow-sm">
                <span className="text-gray-800 font-semibold">Case: {caseId}</span>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-lg px-3 py-1">
                <span className="text-blue-700 text-sm font-medium">
                  Arguments Left: {5 - argumentCount}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-gray-600 text-sm">Welcome, {user.name}</span>
                <button
                  onClick={onBackToDashboard}
                  className="text-gray-600 hover:text-gray-800 text-sm bg-white border border-gray-200 hover:bg-gray-50 px-3 py-1 rounded-lg transition-all"
                >
                  Dashboard
                </button>
                <button
                  onClick={onLogout}
                  className="text-gray-600 hover:text-gray-800 text-sm bg-white border border-gray-200 hover:bg-gray-50 px-3 py-1 rounded-lg transition-all"
                >
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </header>

      {caseId && (
        <div className="max-w-7xl mx-auto p-6 animate-fade-in-up">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-[600px]">
            <SidePanel
              side="sideA"
              title="Plaintiff (Side A)"
              caseId={caseId}
              currentCase={currentCase}
              argumentCount={argumentCount}
              loadCase={loadCase}
              showToast={showToast}
              borderColor="border-red-500"
              bgColor="bg-red-50"
            />

            <JudgePanel
              caseId={caseId}
              currentCase={currentCase}
              aiDecisions={aiDecisions}
              requestJudgment={requestJudgment}
            />

            <SidePanel
              side="sideB"
              title="Defendant (Side B)"
              caseId={caseId}
              currentCase={currentCase}
              argumentCount={argumentCount}
              loadCase={loadCase}
              showToast={showToast}
              borderColor="border-blue-500"
              bgColor="bg-blue-50"
            />
          </div>
        </div>
      )}
      
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
};

export default Courtroom;