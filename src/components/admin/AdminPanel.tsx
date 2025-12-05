import { useState, useEffect } from 'react';
import { LogOut, Users, CheckCircle, XCircle, FileText, TrendingUp, Clock, Database } from 'lucide-react';
import { ApplicationList } from './ApplicationList';
import { ApplicationDetails } from './ApplicationDetails';
import { DashboardStats } from './DashboardStats';
import { getAllApplications, ApplicationRecord } from '../../utils/applicationStorage';
import { generateDemoApplications } from '../../utils/demoDataGenerator';

interface AdminPanelProps {
  onLogout: () => void;
}

export function AdminPanel({ onLogout }: AdminPanelProps) {
  const [applications, setApplications] = useState<ApplicationRecord[]>([]);
  const [selectedApplication, setSelectedApplication] = useState<ApplicationRecord | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [currentUser, setCurrentUser] = useState<string>('');

  useEffect(() => {
    // Load applications from storage
    loadApplications();

    // Get current user
    const auth = sessionStorage.getItem('adminAuth');
    if (auth) {
      const { username } = JSON.parse(auth);
      setCurrentUser(username);
    }

    // Set up interval to refresh data
    const interval = setInterval(loadApplications, 5000);
    return () => clearInterval(interval);
  }, []);

  const loadApplications = () => {
    const apps = getAllApplications();
    setApplications(apps);
  };

  const handleLogout = () => {
    sessionStorage.removeItem('adminAuth');
    onLogout();
  };
  
  const handleGenerateDemo = () => {
    generateDemoApplications(10);
    loadApplications();
  };

  // Filter applications
  const filteredApplications = applications.filter((app) => {
    if (filterStatus === 'all') return true;
    return app.status === filterStatus;
  });

  // Calculate statistics
  const stats = {
    total: applications.length,
    approved: applications.filter((a) => a.status === 'approved').length,
    rejected: applications.filter((a) => a.status === 'rejected').length,
    pending: applications.filter((a) => a.status === 'pending').length,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
                <p className="text-sm text-gray-600">NBFC Loan Management System</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{currentUser}</p>
                <p className="text-xs text-gray-500">Officer</p>
              </div>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Dashboard Stats */}
        <DashboardStats stats={stats} />
        
        {/* Demo Data Button */}
        {applications.length === 0 && (
          <div className="mb-6 text-center">
            <button
              onClick={handleGenerateDemo}
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all flex items-center gap-2 mx-auto shadow-lg"
            >
              <Database className="w-5 h-5" />
              Generate Demo Applications (10)
            </button>
            <p className="text-sm text-gray-500 mt-2">No applications yet. Generate sample data to explore the dashboard.</p>
          </div>
        )}

        {/* Filter Tabs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6">
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setFilterStatus('all')}
              className={`flex-1 px-6 py-4 font-medium transition-all ${
                filterStatus === 'all'
                  ? 'text-indigo-600 border-b-2 border-indigo-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              All Applications ({applications.length})
            </button>
            <button
              onClick={() => setFilterStatus('approved')}
              className={`flex-1 px-6 py-4 font-medium transition-all ${
                filterStatus === 'approved'
                  ? 'text-green-600 border-b-2 border-green-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Approved ({stats.approved})
            </button>
            <button
              onClick={() => setFilterStatus('rejected')}
              className={`flex-1 px-6 py-4 font-medium transition-all ${
                filterStatus === 'rejected'
                  ? 'text-red-600 border-b-2 border-red-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Rejected ({stats.rejected})
            </button>
            <button
              onClick={() => setFilterStatus('pending')}
              className={`flex-1 px-6 py-4 font-medium transition-all ${
                filterStatus === 'pending'
                  ? 'text-yellow-600 border-b-2 border-yellow-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Pending ({stats.pending})
            </button>
          </div>
        </div>

        {/* Applications List */}
        {selectedApplication ? (
          <ApplicationDetails
            application={selectedApplication}
            onBack={() => setSelectedApplication(null)}
          />
        ) : (
          <ApplicationList
            applications={filteredApplications}
            onSelectApplication={setSelectedApplication}
          />
        )}
      </div>
    </div>
  );
}