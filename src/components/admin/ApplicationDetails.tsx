import { ArrowLeft, User, Briefcase, DollarSign, Calendar, Phone, MapPin, FileText, Download } from 'lucide-react';
import { ApplicationRecord } from '../../utils/applicationStorage';
import { generateSanctionPDF } from '../../utils/pdfGenerator';

interface ApplicationDetailsProps {
  application: ApplicationRecord;
  onBack: () => void;
}

export function ApplicationDetails({ application, onBack }: ApplicationDetailsProps) {
  const { data, status, sanctionData, rejectionReason, createdAt } = application;

  const handleDownloadSanction = () => {
    if (sanctionData) {
      generateSanctionPDF(sanctionData, data);
    }
  };

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Applications
      </button>

      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{data.name}</h2>
            <p className="text-gray-600">Application ID: {application.id}</p>
          </div>
          <StatusBadge status={status} />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <span className="text-gray-600">Applied On:</span>
            <p className="font-medium text-gray-900">
              {new Date(createdAt).toLocaleDateString('en-IN')}
            </p>
          </div>
          <div>
            <span className="text-gray-600">Time:</span>
            <p className="font-medium text-gray-900">
              {new Date(createdAt).toLocaleTimeString('en-IN')}
            </p>
          </div>
          {data.creditScore && (
            <div>
              <span className="text-gray-600">Credit Score:</span>
              <p className="font-medium text-gray-900">{data.creditScore}</p>
            </div>
          )}
          {data.tenure && (
            <div>
              <span className="text-gray-600">Tenure:</span>
              <p className="font-medium text-gray-900">{data.tenure} months</p>
            </div>
          )}
        </div>
      </div>

      {/* Personal Information */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <User className="w-5 h-5 text-indigo-600" />
          Personal Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InfoItem label="Full Name" value={data.name || 'N/A'} />
          <InfoItem label="Age" value={data.age ? `${data.age} years` : 'N/A'} />
          <InfoItem label="Phone" value={data.phone || 'N/A'} icon={Phone} />
          <InfoItem label="City" value={data.city || 'N/A'} icon={MapPin} />
        </div>
      </div>

      {/* Employment & Financial */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Briefcase className="w-5 h-5 text-indigo-600" />
          Employment & Financial Details
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InfoItem label="Employment Type" value={data.employmentType || 'N/A'} />
          <InfoItem
            label="Monthly Income"
            value={data.monthlyIncome ? `₹${data.monthlyIncome.toLocaleString('en-IN')}` : 'N/A'}
          />
          <InfoItem
            label="Existing EMI"
            value={data.existingEMI ? `₹${data.existingEMI.toLocaleString('en-IN')}` : '₹0'}
          />
          <InfoItem label="Loan Purpose" value={data.loanPurpose || 'N/A'} />
        </div>
      </div>

      {/* Loan Details */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <DollarSign className="w-5 h-5 text-indigo-600" />
          Loan Details
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InfoItem
            label="Requested Amount"
            value={data.loanAmount ? `₹${data.loanAmount.toLocaleString('en-IN')}` : 'N/A'}
          />
          <InfoItem label="Tenure" value={data.tenure ? `${data.tenure} months` : 'N/A'} />
          {data.eligibilityResult && (
            <>
              <InfoItem
                label="Max Eligible Loan"
                value={`₹${data.eligibilityResult.maxEligibleLoan.toLocaleString('en-IN')}`}
              />
              <InfoItem
                label="EMI-to-Income Ratio"
                value={`${data.eligibilityResult.emiToIncomeRatio.toFixed(1)}%`}
              />
            </>
          )}
        </div>
      </div>

      {/* Sanction Details (If Approved) */}
      {status === 'approved' && sanctionData && (
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-green-900 flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Sanction Details
            </h3>
            <button
              onClick={handleDownloadSanction}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Download Letter
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-lg p-4">
              <span className="text-sm text-gray-600">Approved Amount</span>
              <p className="text-xl font-bold text-green-700">
                ₹{sanctionData.approvedAmount.toLocaleString('en-IN')}
              </p>
            </div>
            <div className="bg-white rounded-lg p-4">
              <span className="text-sm text-gray-600">Monthly EMI</span>
              <p className="text-xl font-bold text-green-700">
                ₹{sanctionData.emi.toLocaleString('en-IN')}
              </p>
            </div>
            <div className="bg-white rounded-lg p-4">
              <span className="text-sm text-gray-600">Interest Rate</span>
              <p className="text-xl font-bold text-green-700">{sanctionData.interestRate}% p.a.</p>
            </div>
            <div className="bg-white rounded-lg p-4">
              <span className="text-sm text-gray-600">Processing Fee</span>
              <p className="font-semibold text-gray-900">
                ₹{sanctionData.processingFee.toLocaleString('en-IN')}
              </p>
            </div>
            <div className="bg-white rounded-lg p-4">
              <span className="text-sm text-gray-600">Total Interest</span>
              <p className="font-semibold text-gray-900">
                ₹{sanctionData.totalInterest.toLocaleString('en-IN')}
              </p>
            </div>
            <div className="bg-white rounded-lg p-4">
              <span className="text-sm text-gray-600">Total Repayment</span>
              <p className="font-semibold text-gray-900">
                ₹{sanctionData.totalRepayment.toLocaleString('en-IN')}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Rejection Details (If Rejected) */}
      {status === 'rejected' && rejectionReason && (
        <div className="bg-red-50 rounded-xl border border-red-200 p-6">
          <h3 className="text-lg font-semibold text-red-900 mb-3">Rejection Reason</h3>
          <p className="text-red-800 whitespace-pre-wrap">{rejectionReason}</p>
        </div>
      )}

      {/* Eligibility Assessment */}
      {data.eligibilityResult && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Eligibility Assessment</h3>
          <p className="text-gray-700 whitespace-pre-wrap">{data.eligibilityResult.justification}</p>
        </div>
      )}
    </div>
  );
}

function InfoItem({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string;
  icon?: React.ElementType;
}) {
  return (
    <div>
      <span className="text-sm text-gray-600">{label}</span>
      <div className="flex items-center gap-2 mt-1">
        {Icon && <Icon className="w-4 h-4 text-gray-400" />}
        <p className="font-medium text-gray-900">{value}</p>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const config = {
    approved: {
      bg: 'bg-green-100',
      text: 'text-green-800',
      label: 'Approved',
    },
    rejected: {
      bg: 'bg-red-100',
      text: 'text-red-800',
      label: 'Rejected',
    },
    pending: {
      bg: 'bg-yellow-100',
      text: 'text-yellow-800',
      label: 'Pending',
    },
  };

  const style = config[status as keyof typeof config] || config.pending;

  return (
    <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold ${style.bg} ${style.text}`}>
      {style.label}
    </span>
  );
}
