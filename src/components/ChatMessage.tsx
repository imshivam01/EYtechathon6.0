import { Bot, User, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';

interface Message {
  id: string;
  type: 'bot' | 'user';
  content: string;
  status?: 'success' | 'error' | 'warning';
  metadata?: Record<string, any>;
}

interface ChatMessageProps {
  message: Message;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isBot = message.type === 'bot';

  return (
    <div className={`flex gap-3 ${isBot ? 'justify-start' : 'justify-end'}`}>
      {isBot && (
        <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center flex-shrink-0">
          <Bot className="w-5 h-5 text-white" />
        </div>
      )}
      
      <div className={`max-w-[75%] ${isBot ? '' : 'flex flex-col items-end'}`}>
        <div
          className={`px-4 py-3 rounded-2xl ${
            isBot
              ? 'bg-gray-100 text-gray-900 rounded-tl-none'
              : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-tr-none'
          }`}
        >
          <div className="whitespace-pre-wrap">{message.content}</div>
          
          {message.status && (
            <div className={`flex items-center gap-2 mt-2 text-sm ${isBot ? '' : 'text-blue-50'}`}>
              {message.status === 'success' && <CheckCircle className="w-4 h-4" />}
              {message.status === 'error' && <XCircle className="w-4 h-4" />}
              {message.status === 'warning' && <AlertTriangle className="w-4 h-4" />}
              <span>
                {message.status === 'success' && 'Verified'}
                {message.status === 'error' && 'Action Required'}
                {message.status === 'warning' && 'Please Note'}
              </span>
            </div>
          )}
        </div>
        
        {message.metadata?.timestamp && (
          <span className="text-xs text-gray-500 mt-1 px-2">
            {new Date(message.metadata.timestamp).toLocaleTimeString()}
          </span>
        )}
      </div>
      
      {!isBot && (
        <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0">
          <User className="w-5 h-5 text-gray-700" />
        </div>
      )}
    </div>
  );
}
