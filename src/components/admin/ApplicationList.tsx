import { CheckCircle, XCircle, Clock, Eye } from 'lucide-react';
import { ApplicationRecord } from '../../utils/applicationStorage';

interface ApplicationListProps {
  applications: ApplicationRecord[];
  onSelectApplication: (app: ApplicationRecord) => void;
}

export function ApplicationList({ applications, onSelectApplication }: ApplicationListProps) {
  if (applications.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Clock className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Applications Found</h3>
        <p className="text-gray-600">Applications will appear here once customers start applying.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Application ID
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Applicant
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Loan Amount
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {applications.map((app) => (
              <tr key={app.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <span className="font-mono text-sm text-gray-900">{app.id}</span>
                </td>
                <td className="px-6 py-4">
                  <div>
                    <p className="font-medium text-gray-900">{app.data.name}</p>
                    <p className="text-sm text-gray-600">{app.data.phone}</p>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <p className="font-medium text-gray-900">
                    ₹{app.data.loanAmount?.toLocaleString('en-IN')}
                  </p>
                  {app.sanctionData && (
                    <p className="text-sm text-green-600">
                      Approved: ₹{app.sanctionData.approvedAmount.toLocaleString('en-IN')}
                    </p>
                  )}
                </td>
                <td className="px-6 py-4">
                  <StatusBadge status={app.status} />
                </td>
                <td className="px-6 py-4">
                  <p className="text-sm text-gray-900">
                    {new Date(app.createdAt).toLocaleDateString('en-IN')}
                  </p>
                  <p className="text-xs text-gray-500">
                    {new Date(app.createdAt).toLocaleTimeString('en-IN')}
                  </p>
                </td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => onSelectApplication(app)}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all flex items-center gap-2 text-sm"
                  >
                    <Eye className="w-4 h-4" />
                    View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const config = {
    approved: {
      icon: CheckCircle,
      bg: 'bg-green-100',
      text: 'text-green-800',
      label: 'Approved',
    },
    rejected: {
      icon: XCircle,
      bg: 'bg-red-100',
      text: 'text-red-800',
      label: 'Rejected',
    },
    pending: {
      icon: Clock,
      bg: 'bg-yellow-100',
      text: 'text-yellow-800',
      label: 'Pending',
    },
  };

  const style = config[status as keyof typeof config] || config.pending;
  const Icon = style.icon;

  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium ${style.bg} ${style.text}`}>
      <Icon className="w-4 h-4" />
      {style.label}
    </span>
  );
}
