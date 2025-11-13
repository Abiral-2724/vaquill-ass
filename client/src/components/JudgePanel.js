import React from 'react';

const JudgePanel = ({ caseId, currentCase, aiDecisions, requestJudgment }) => {
  const [judging, setJudging] = React.useState(false);
  const hasEvidence = currentCase?.sideA?.documents?.length > 0 || currentCase?.sideB?.documents?.length > 0;
  
  // Debug logging
  React.useEffect(() => {
    console.log('📊 JudgePanel - aiDecisions updated:', aiDecisions);
  }, [aiDecisions]);

  const handleRequestJudgment = async () => {
    setJudging(true);
    try {
      await requestJudgment();
    } finally {
      setJudging(false);
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-lg p-6 flex flex-col items-center">
      {/* Judge Icon */}
      <div className="text-6xl mb-4 animate-pulse">⚖️</div>
      
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">AI Judge</h2>
      
      {/* Request Judgment Button */}
      <button
        onClick={handleRequestJudgment}
        disabled={!hasEvidence || judging}
        className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-4 px-8 rounded-lg shadow-lg hover:shadow-xl transform transition-all duration-300 hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed mb-6 flex items-center justify-center"
      >
        {judging ? (
          <>
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
            AI Analyzing...
          </>
        ) : (
          <>⚖️ Request Judgment</>
        )}
      </button>

      {!hasEvidence && (
        <p className="text-sm text-blue-700 text-center mb-4 bg-blue-50 border border-blue-200 p-4 rounded-lg">
          Upload documents from both sides to request judgment
        </p>
      )}

      {/* AI Decisions */}
      <div className="w-full max-h-96 overflow-y-auto space-y-4">
        <h3 className="font-semibold text-gray-800 text-center border-b border-gray-200 pb-2 mb-4">
          Judicial Decisions
        </h3>
        
        {aiDecisions.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            <div className="text-4xl mb-2">🏛️</div>
            <p className="text-gray-700">No decisions yet</p>
            <p className="text-sm text-gray-500">Present your case to receive judgment</p>
          </div>
        ) : (
          aiDecisions.map((decision, idx) => (
            <div key={idx} className="bg-gray-50 border border-gray-200 rounded-lg p-6 shadow-md">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-bold text-gray-800 flex items-center text-lg">
                  ⚖️ Decision #{decision.round}
                </h4>
                <span className="text-xs text-gray-500 bg-white px-2 py-1 rounded border">
                  {new Date(decision.timestamp).toLocaleString()}
                </span>
              </div>
              
              <div className="space-y-3">
                <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-lg">
                  <p className="font-bold text-green-800 mb-2 text-lg flex items-center">
                    🏆 Verdict:
                  </p>
                  <p className="text-green-700 font-semibold text-base bg-white p-3 rounded border border-green-200">{decision.decision}</p>
                </div>
                
                <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-lg">
                  <p className="font-bold text-blue-800 mb-2 text-lg flex items-center">
                    📜 Legal Reasoning:
                  </p>
                  <p className="text-blue-700 leading-relaxed bg-white p-3 rounded border border-blue-200">{decision.reasoning}</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default JudgePanel;