import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Dashboard = ({ user, onLogout, onSelectCase, onCreateCase }) => {
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCases();
  }, []);

  const loadCases = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5001/api/cases/user', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCases(response.data);
    } catch (error) {
      console.error('Error loading cases:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (case_) => {
    if (case_.aiDecisions?.length > 0) return 'bg-green-100 text-green-800';
    if (case_.argumentCount > 0) return 'bg-yellow-100 text-yellow-800';
    return 'bg-gray-100 text-gray-800';
  };

  const getStatusText = (case_) => {
    if (case_.aiDecisions?.length > 0) return 'Decided';
    if (case_.argumentCount > 0) return 'In Progress';
    return 'New';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-md shadow-sm border-b border-gray-100 p-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
              <span className="text-white text-xl">⚖️</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">AI Judge</h1>
              <p className="text-sm text-gray-600">Dashboard</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <span className="text-gray-600">Welcome, {user.name}</span>
            <button
              onClick={onLogout}
              className="text-gray-600 hover:text-gray-800 bg-white border border-gray-200 hover:bg-gray-50 px-4 py-2 rounded-lg transition-all duration-300"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-6">
        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8 animate-fade-in-up">
          <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Cases</p>
                <p className="text-3xl font-bold text-gray-900">{cases.length}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <span className="text-blue-600 text-xl">📁</span>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Decided</p>
                <p className="text-3xl font-bold text-green-600">
                  {cases.filter(c => c.aiDecisions?.length > 0).length}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <span className="text-green-600 text-xl">✅</span>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">In Progress</p>
                <p className="text-3xl font-bold text-yellow-600">
                  {cases.filter(c => c.argumentCount > 0 && !c.aiDecisions?.length).length}
                </p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                <span className="text-yellow-600 text-xl">⏳</span>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Success Rate</p>
                <p className="text-3xl font-bold text-indigo-600">98%</p>
              </div>
              <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center">
                <span className="text-indigo-600 text-xl">🎯</span>
              </div>
            </div>
          </div>
        </div>

        {/* Cases Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6 animate-fade-in-up animation-delay-200">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900">Your Cases</h2>
            <button
              onClick={onCreateCase}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 hover:-translate-y-1 transition-all duration-300"
            >
              Create New Case
            </button>
          </div>
          
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : cases.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">⚖️</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No cases yet</h3>
              <p className="text-gray-600 mb-6">Create your first case to get started with AI-powered legal judgment</p>
              <button
                onClick={onCreateCase}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300"
              >
                Create Your First Case
              </button>
            </div>
          ) : (
            <div className="grid gap-4">
              {cases.map((case_, idx) => (
                <div
                  key={case_.caseId}
                  className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-all duration-300 cursor-pointer animate-fade-in-up"
                  style={{ animationDelay: `${idx * 100}ms` }}
                  onClick={() => onSelectCase(case_.caseId)}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="font-semibold text-gray-900">{case_.caseId}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(case_)}`}>
                          {getStatusText(case_)}
                        </span>
                      </div>
                      <div className="grid md:grid-cols-3 gap-4 text-sm text-gray-600">
                        <div>
                          <span className="font-medium">Arguments:</span> {case_.argumentCount}/5
                        </div>
                        <div>
                          <span className="font-medium">Documents:</span> {(case_.sideA?.documents?.length || 0) + (case_.sideB?.documents?.length || 0)}
                        </div>
                        <div>
                          <span className="font-medium">Created:</span> {new Date(case_.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <div className="text-gray-400">
                      →
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;