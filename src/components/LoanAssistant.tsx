import { useState, useRef, useEffect } from 'react';
import { Send, FileText, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { ChatMessage } from './ChatMessage';
import { SanctionLetter } from './SanctionLetter';
import { useLoanJourney } from '../hooks/useLoanJourney';

export function LoanAssistant() {
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const {
    messages,
    isProcessing,
    applicationData,
    sanctionData,
    handleUserMessage,
    showSanctionLetter,
  } = useLoanJourney();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim() && !isProcessing) {
      handleUserMessage(inputValue.trim());
      setInputValue('');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 h-screen flex flex-col">
      {/* Header */}
      <div className="bg-white rounded-t-2xl shadow-lg p-6 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center">
            <FileText className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Loan Assistant</h1>
            <p className="text-sm text-gray-600">Your trusted NBFC partner</p>
          </div>
        </div>
        
        {/* Progress Indicator */}
        {applicationData.stage && applicationData.stage !== 'greeting' && (
          <div className="mt-4">
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="text-gray-600">Application Progress</span>
              <span className="text-indigo-600 font-semibold">{getStageLabel(applicationData.stage)}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-blue-600 to-indigo-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${getStageProgress(applicationData.stage)}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Messages Area */}
      <div className="flex-1 bg-white shadow-lg overflow-y-auto p-6 space-y-4">
        {messages.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))}
        {isProcessing && (
          <div className="flex items-center gap-2 text-gray-500">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span className="text-sm">Processing...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      {!showSanctionLetter && (
        <div className="bg-white rounded-b-2xl shadow-lg p-4 border-t border-gray-200">
          <form onSubmit={handleSubmit} className="flex gap-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Type your response..."
              disabled={isProcessing}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
            <button
              type="submit"
              disabled={!inputValue.trim() || isProcessing}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
            >
              <Send className="w-4 h-4" />
              Send
            </button>
          </form>
        </div>
      )}

      {/* Sanction Letter Modal */}
      {showSanctionLetter && sanctionData && (
        <SanctionLetter sanctionData={sanctionData} applicationData={applicationData} />
      )}
    </div>
  );
}

function getStageProgress(stage: string): number {
  const stages: Record<string, number> = {
    'greeting': 0,
    'data_collection': 20,
    'sales_agent': 40,
    'verification_agent': 60,
    'underwriting_agent': 80,
    'sanction_agent': 100,
    'completed': 100,
  };
  return stages[stage] || 0;
}

function getStageLabel(stage: string): string {
  const labels: Record<string, string> = {
    'greeting': 'Welcome',
    'data_collection': 'Data Collection',
    'sales_agent': 'Sales Verification',
    'verification_agent': 'KYC Check',
    'underwriting_agent': 'Credit Assessment',
    'sanction_agent': 'Sanction Processing',
    'completed': 'Completed',
  };
  return labels[stage] || stage;
}
