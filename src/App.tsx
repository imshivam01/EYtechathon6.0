import { useState } from 'react';
import { LoanAssistant } from './components/LoanAssistant';
import { AdminPanel } from './components/admin/AdminPanel';
import { AdminLogin } from './components/admin/AdminLogin';

export default function App() {
  const [view, setView] = useState<'customer' | 'admin'>('customer');
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);

  const handleAdminLogin = () => {
    setIsAdminAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAdminAuthenticated(false);
    setView('customer');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      {/* View Toggle Button */}
      <div className="fixed top-4 right-4 z-50">
        {view === 'customer' ? (
          <button
            onClick={() => setView('admin')}
            className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-all shadow-lg text-sm"
          >
            Officer Login
          </button>
        ) : !isAdminAuthenticated ? (
          <button
            onClick={() => setView('customer')}
            className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-all shadow-lg text-sm"
          >
            Customer View
          </button>
        ) : null}
      </div>

      {/* Main Content */}
      {view === 'customer' ? (
        <LoanAssistant />
      ) : !isAdminAuthenticated ? (
        <AdminLogin onLogin={handleAdminLogin} onBack={() => setView('customer')} />
      ) : (
        <AdminPanel onLogout={handleLogout} />
      )}
    </div>
  );
}