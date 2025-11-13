import React, { useState } from 'react';
import axios from 'axios';

const SidePanel = ({ side, title, caseId, currentCase, argumentCount, loadCase, showToast, borderColor, bgColor }) => {
  const [files, setFiles] = useState([]);
  const [argument, setArgument] = useState('');
  const [uploading, setUploading] = useState(false);

  const uploadFiles = async () => {
    if (!files.length) return;
    
    setUploading(true);
    const formData = new FormData();
    Array.from(files).forEach(file => formData.append('documents', file));

    try {
      const token = localStorage.getItem('token');
      await axios.post(`http://localhost:5001/api/cases/${caseId}/upload/${side}`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      showToast('Files uploaded successfully!');
      setFiles([]);
      loadCase();
    } catch (error) {
      showToast('Error uploading files: ' + error.message, 'error');
    } finally {
      setUploading(false);
    }
  };

  const submitArgument = async () => {
    if (!argument.trim()) return;
    
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`http://localhost:5001/api/cases/${caseId}/argue/${side}`, 
        { argument }, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setArgument('');
      showToast('Argument submitted successfully!');
      loadCase(); // Reload to update argument count
    } catch (error) {
      showToast('Error submitting argument: ' + error.message, 'error');
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-lg p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-6 text-center">{title}</h2>
      
      {/* File Upload Section */}
      <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-2xl p-4 mb-6">
        <input
          type="file"
          multiple
          onChange={(e) => setFiles(e.target.files)}
          accept=".pdf,.doc,.docx,.txt"
          className="w-full mb-3 text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-blue-100 file:text-blue-700 hover:file:bg-blue-200"
        />
        <button
          onClick={uploadFiles}
          disabled={!files.length || uploading}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white py-3 px-4 rounded-lg transition-all transform hover:scale-105 disabled:scale-100 flex items-center justify-center font-semibold shadow-lg hover:shadow-xl"
        >
          {uploading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Uploading...
            </>
          ) : (
            'Upload Documents'
          )}
        </button>
      </div>
      
      {/* Documents Count */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
        <h4 className="font-semibold text-gray-800 flex items-center">
          📄 Documents: <span className="ml-2 bg-blue-100 text-blue-700 px-2 py-1 rounded-lg text-sm font-medium">{currentCase?.[side]?.documents?.length || 0}</span>
        </h4>
      </div>

      {/* Arguments Section */}
      <div className="space-y-4">
        <h4 className="font-semibold text-gray-800 border-b border-gray-200 pb-2 mb-4">Arguments:</h4>
        
        <div className="max-h-48 overflow-y-auto space-y-3">
          {currentCase?.[side]?.arguments?.map((arg, idx) => (
            <div key={idx} className="bg-gray-50 border border-gray-200 p-4 rounded-2xl border-l-4 border-blue-500">
              <p className="text-sm text-gray-800 leading-relaxed">{arg.text}</p>
              <small className="text-gray-500 text-xs">{new Date(arg.timestamp).toLocaleString()}</small>
            </div>
          ))}
        </div>
        
        {argumentCount < 5 && (
          <div className="space-y-3">
            <textarea
              value={argument}
              onChange={(e) => setArgument(e.target.value)}
              placeholder="Enter your legal argument..."
              rows="4"
              className="w-full p-4 bg-white border border-gray-300 rounded-2xl text-gray-800 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none transition-all"
            />
            <button
              onClick={submitArgument}
              disabled={!argument.trim()}
              className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white py-3 px-4 rounded-lg transition-all transform hover:scale-105 disabled:scale-100 font-semibold shadow-lg hover:shadow-xl"
            >
              Submit Argument
            </button>
          </div>
        )}
        
        {argumentCount >= 5 && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            Maximum arguments reached (5/5)
          </div>
        )}
      </div>
    </div>
  );
};

export default SidePanel;