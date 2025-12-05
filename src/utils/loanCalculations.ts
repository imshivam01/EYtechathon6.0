interface EligibilityResult {
  decision: 'approved' | 'approved_reduced' | 'rejected';
  approvedAmount: number;
  maxEligibleLoan: number;
  emiToIncomeRatio: number;
  justification: string;
}

export function calculateEligibility(
  monthlyIncome: number,
  existingEMI: number,
  requestedAmount: number,
  tenure: number,
  creditScore: number
): EligibilityResult {
  // Calculate max eligible loan using the formula
  // Max Eligible Loan = (Monthly Income × 60%) × Tenure (in months)
  const maxEligibleLoan = monthlyIncome * 0.6 * tenure;

  // Calculate final approval limit considering existing EMI
  // Final Approval Limit = [(0.6 × Income) – Existing EMI] × Tenure
  const finalApprovalLimit = ((0.6 * monthlyIncome) - existingEMI) * tenure;

  // Calculate what the EMI would be if approved
  const potentialEMI = requestedAmount / tenure;
  const totalEMI = existingEMI + potentialEMI;
  const emiToIncomeRatio = (totalEMI / monthlyIncome) * 100;

  // Decision Logic
  
  // Reject if income-to-EMI stress > 50%
  if (emiToIncomeRatio > 50) {
    return {
      decision: 'rejected',
      approvedAmount: 0,
      maxEligibleLoan: Math.round(finalApprovalLimit),
      emiToIncomeRatio,
      justification: `Your total EMI burden (${emiToIncomeRatio.toFixed(1)}%) exceeds 50% of your monthly income. This poses a high repayment risk. We recommend reducing existing obligations before reapplying.`,
    };
  }

  // Reject if score < 700 AND requested > final approval limit
  if (creditScore < 700 && requestedAmount > finalApprovalLimit) {
    return {
      decision: 'rejected',
      approvedAmount: 0,
      maxEligibleLoan: Math.round(finalApprovalLimit),
      emiToIncomeRatio,
      justification: `Your credit score (${creditScore}) is below 700, and the requested amount exceeds your financial capacity. Maximum eligible amount based on your income is ₹${Math.round(finalApprovalLimit).toLocaleString('en-IN')}. Please improve your credit score or request a lower amount.`,
    };
  }

  // Reject if credit score < 650
  if (creditScore < 650) {
    return {
      decision: 'rejected',
      approvedAmount: 0,
      maxEligibleLoan: Math.round(finalApprovalLimit),
      emiToIncomeRatio,
      justification: `Your credit score (${creditScore}) is below our minimum threshold of 650. We recommend improving your credit score by timely payment of existing obligations and clearing any defaults.`,
    };
  }

  // Instant approval if requested <= final approval limit
  if (requestedAmount <= finalApprovalLimit) {
    return {
      decision: 'approved',
      approvedAmount: requestedAmount,
      maxEligibleLoan: Math.round(finalApprovalLimit),
      emiToIncomeRatio,
      justification: `Your loan request is within your approved limit. With a credit score of ${creditScore} and EMI-to-income ratio of ${emiToIncomeRatio.toFixed(1)}%, you qualify for instant approval.`,
    };
  }

  // Offer reduced amount if requested > final approval limit but <= 120%
  if (requestedAmount > finalApprovalLimit && requestedAmount <= finalApprovalLimit * 1.2) {
    const reducedAmount = Math.round(finalApprovalLimit);
    return {
      decision: 'approved_reduced',
      approvedAmount: reducedAmount,
      maxEligibleLoan: Math.round(finalApprovalLimit),
      emiToIncomeRatio: ((existingEMI + (reducedAmount / tenure)) / monthlyIncome) * 100,
      justification: `Your requested amount exceeds your maximum eligible limit by a small margin. Based on your income and existing obligations, we can approve ₹${reducedAmount.toLocaleString('en-IN')}, which ensures comfortable repayment within your financial capacity.`,
    };
  }

  // Reject if requested > 120% of final approval limit
  return {
    decision: 'rejected',
    approvedAmount: 0,
    maxEligibleLoan: Math.round(finalApprovalLimit),
    emiToIncomeRatio,
    justification: `Your requested amount significantly exceeds your financial capacity. Maximum amount you can borrow is ₹${Math.round(finalApprovalLimit).toLocaleString('en-IN')}. The requested amount is too high relative to your income and would pose repayment difficulties.`,
  };
}

export function calculateEMI(principal: number, annualRate: number, tenureMonths: number): number {
  // EMI = [P × R × (1+R)^N] / [(1+R)^N – 1]
  // Where:
  // P = Loan Principal
  // R = Monthly Interest Rate (Annual Rate / 12 / 100)
  // N = Tenure in Months

  const monthlyRate = annualRate / 12 / 100;
  const emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, tenureMonths)) /
              (Math.pow(1 + monthlyRate, tenureMonths) - 1);
  
  return Math.round(emi);
}
