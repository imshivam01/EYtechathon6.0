export function generateSanctionPDF(sanctionData: any, applicationData: any) {
  // Create a formatted text document for the sanction letter
  const content = `
═══════════════════════════════════════════════════════════
                    LOAN SANCTION LETTER
═══════════════════════════════════════════════════════════

Date of Issue: ${new Date(sanctionData.dateOfIssue).toLocaleDateString('en-IN')}
Reference No: NBFC-${Date.now().toString().slice(-8)}

═══════════════════════════════════════════════════════════

APPLICANT DETAILS:
─────────────────────────────────────────────────────────
Name:                ${applicationData.name}
Age:                 ${applicationData.age} years
Employment Type:     ${applicationData.employmentType}
Monthly Income:      ₹${applicationData.monthlyIncome?.toLocaleString('en-IN')}
City:                ${applicationData.city}
Contact Number:      ${applicationData.phone}

═══════════════════════════════════════════════════════════

LOAN DETAILS:
─────────────────────────────────────────────────────────
Loan Purpose:        ${applicationData.loanPurpose}
Sanctioned Amount:   ₹${sanctionData.approvedAmount.toLocaleString('en-IN')}
Tenure:              ${sanctionData.tenure} months
Interest Rate:       ${sanctionData.interestRate}% per annum
Processing Fee:      ₹${sanctionData.processingFee.toLocaleString('en-IN')}

═══════════════════════════════════════════════════════════

REPAYMENT SCHEDULE:
─────────────────────────────────────────────────────────
Monthly EMI:         ₹${sanctionData.emi.toLocaleString('en-IN')}
Total Interest:      ₹${sanctionData.totalInterest.toLocaleString('en-IN')}
Total Repayment:     ₹${sanctionData.totalRepayment.toLocaleString('en-IN')}

First EMI Due Date:  ${getFirstEMIDate()}

═══════════════════════════════════════════════════════════

IMPORTANT NOTES:
─────────────────────────────────────────────────────────
• This sanction letter is valid for ${sanctionData.validity} days from the 
  date of issue.
• The loan is subject to final documentation and verification.
• Processing fee of ₹${sanctionData.processingFee.toLocaleString('en-IN')} is non-refundable.
• EMI will be auto-debited from your registered bank account.
• Pre-payment charges may apply as per loan agreement.
• Default in payment will attract penalty charges and may 
  affect your credit score.

═══════════════════════════════════════════════════════════

TERMS & CONDITIONS:
─────────────────────────────────────────────────────────
1. The borrower must submit all required documents within 
   7 working days.
2. The loan agreement must be signed in the presence of 
   authorized personnel.
3. The interest rate is subject to change as per NBFC policy.
4. In case of pre-closure, applicable charges will be levied.
5. The borrower must maintain adequate balance for EMI 
   auto-debit.
6. Any default may result in legal action and credit score 
   impact.

═══════════════════════════════════════════════════════════

CONTACT INFORMATION:
─────────────────────────────────────────────────────────
Customer Support: 1800-XXX-XXXX
Email: support@nbfc.com
Website: www.nbfc.com

Operating Hours: Monday to Saturday, 9:00 AM - 6:00 PM

═══════════════════════════════════════════════════════════

This is a system-generated sanction letter and does not 
require a physical signature.

Issued by: AI Loan Assistance System
NBFC Registration No: XXXX-XXXX-XXXX

═══════════════════════════════════════════════════════════

Congratulations on your loan approval!
We look forward to serving you.

═══════════════════════════════════════════════════════════
`;

  // Create and download the file
  const blob = new Blob([content], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `Sanction_Letter_${applicationData.name.replace(/\s+/g, '_')}_${Date.now()}.txt`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function getFirstEMIDate(): string {
  const today = new Date();
  const firstEMI = new Date(today.getFullYear(), today.getMonth() + 1, 5);
  return firstEMI.toLocaleDateString('en-IN', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
}
