import { FileText, Download, CheckCircle } from 'lucide-react';
import { generateSanctionPDF } from '../utils/pdfGenerator';

interface SanctionLetterProps {
  sanctionData: any;
  applicationData: any;
}

export function SanctionLetter({ sanctionData, applicationData }: SanctionLetterProps) {
  const handleDownload = () => {
    generateSanctionPDF(sanctionData, applicationData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white p-6 rounded-t-2xl">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-12 h-12" />
            <div>
              <h2 className="text-2xl font-bold">Loan Approved!</h2>
              <p className="text-green-50">Congratulations on your loan sanction</p>
            </div>
          </div>
        </div>

        {/* Sanction Details */}
        <div className="p-6 space-y-6">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Sanctioned Amount</p>
                <p className="text-2xl font-bold text-green-700">₹{sanctionData.approvedAmount.toLocaleString('en-IN')}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Monthly EMI</p>
                <p className="text-2xl font-bold text-green-700">₹{sanctionData.emi.toLocaleString('en-IN')}</p>
              </div>
            </div>
          </div>

          {/* Detailed Information */}
          <div className="border border-gray-200 rounded-lg p-4 space-y-3">
            <h3 className="font-semibold text-gray-900">Loan Details</h3>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-gray-600">Applicant Name:</span>
                <p className="font-medium">{applicationData.name}</p>
              </div>
              <div>
                <span className="text-gray-600">Loan Tenure:</span>
                <p className="font-medium">{sanctionData.tenure} months</p>
              </div>
              <div>
                <span className="text-gray-600">Interest Rate:</span>
                <p className="font-medium">{sanctionData.interestRate}% per annum</p>
              </div>
              <div>
                <span className="text-gray-600">Processing Fee:</span>
                <p className="font-medium">₹{sanctionData.processingFee.toLocaleString('en-IN')}</p>
              </div>
              <div>
                <span className="text-gray-600">Total Interest:</span>
                <p className="font-medium">₹{sanctionData.totalInterest.toLocaleString('en-IN')}</p>
              </div>
              <div>
                <span className="text-gray-600">Total Repayment:</span>
                <p className="font-medium">₹{sanctionData.totalRepayment.toLocaleString('en-IN')}</p>
              </div>
            </div>
          </div>

          {/* Validity */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-sm text-yellow-800">
              <strong>Offer Validity:</strong> This sanction letter is valid for {sanctionData.validity} days from the date of issue.
            </p>
          </div>

          {/* Terms */}
          <div className="text-xs text-gray-600 space-y-1">
            <p><strong>Terms & Conditions:</strong></p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>The loan is subject to final documentation and verification</li>
              <li>Processing fee is non-refundable</li>
              <li>Interest rate is subject to change as per NBFC policy</li>
              <li>Pre-payment charges may apply as per loan agreement</li>
              <li>Default in payment may attract penalty charges</li>
            </ul>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={handleDownload}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all flex items-center justify-center gap-2"
            >
              <Download className="w-5 h-5" />
              Download Sanction Letter
            </button>
          </div>

          <div className="text-center text-sm text-gray-600">
            <p>For any queries, please contact our customer support</p>
            <p className="font-medium">📞 1800-XXX-XXXX | ✉️ support@nbfc.com</p>
          </div>
        </div>
      </div>
    </div>
  );
}
