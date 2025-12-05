import { saveApplication } from './applicationStorage';

const firstNames = ['Rahul', 'Priya', 'Amit', 'Sneha', 'Vikram', 'Anjali', 'Rohan', 'Kavya', 'Arjun', 'Neha'];
const lastNames = ['Sharma', 'Patel', 'Kumar', 'Singh', 'Gupta', 'Reddy', 'Verma', 'Desai', 'Mehta', 'Joshi'];
const cities = ['Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai', 'Pune', 'Kolkata', 'Ahmedabad'];
const purposes = ['Medical', 'Education', 'Business', 'Wedding', 'Home Renovation', 'Debt Consolidation', 'Travel', 'Emergency'];
const employmentTypes = ['Salaried', 'Self-employed'];

function randomItem<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

function randomNumber(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function generateDemoApplications(count: number = 10) {
  const applications = [];

  for (let i = 0; i < count; i++) {
    const firstName = randomItem(firstNames);
    const lastName = randomItem(lastNames);
    const name = `${firstName} ${lastName}`;
    const age = randomNumber(25, 55);
    const employmentType = randomItem(employmentTypes);
    const monthlyIncome = randomNumber(20, 100) * 1000;
    const existingEMI = Math.random() > 0.6 ? randomNumber(2, 15) * 1000 : 0;
    const loanAmount = randomNumber(50, 500) * 1000;
    const city = randomItem(cities);
    const phone = `9${randomNumber(100000000, 999999999)}`;
    const tenure = randomItem([12, 24, 36, 48, 60]);
    const loanPurpose = randomItem(purposes);
    const creditScore = randomNumber(600, 850);

    // Calculate eligibility
    const maxEligibleLoan = monthlyIncome * 0.6 * tenure;
    const finalApprovalLimit = ((0.6 * monthlyIncome) - existingEMI) * tenure;
    const potentialEMI = loanAmount / tenure;
    const emiToIncomeRatio = ((existingEMI + potentialEMI) / monthlyIncome) * 100;

    // Determine status
    let status: 'approved' | 'rejected' | 'pending';
    let sanctionData = null;
    let rejectionReason = null;

    // Random chance for pending
    if (Math.random() < 0.1) {
      status = 'pending';
    } else if (
      emiToIncomeRatio > 50 ||
      (creditScore < 700 && loanAmount > finalApprovalLimit) ||
      creditScore < 650
    ) {
      status = 'rejected';
      rejectionReason = creditScore < 650
        ? `Credit score (${creditScore}) is below minimum threshold of 650.`
        : emiToIncomeRatio > 50
        ? `EMI-to-income ratio (${emiToIncomeRatio.toFixed(1)}%) exceeds 50% limit.`
        : `Credit score is below 700 and requested amount exceeds financial capacity.`;
    } else {
      status = 'approved';
      const approvedAmount = loanAmount <= finalApprovalLimit
        ? loanAmount
        : Math.round(finalApprovalLimit);
      
      const interestRate = creditScore >= 800 ? 12.0 : creditScore >= 750 ? 13.5 : creditScore >= 700 ? 15.0 : 16.5;
      const monthlyRate = interestRate / 12 / 100;
      const emi = Math.round((approvedAmount * monthlyRate * Math.pow(1 + monthlyRate, tenure)) /
                             (Math.pow(1 + monthlyRate, tenure) - 1));
      const totalRepayment = emi * tenure;
      const totalInterest = totalRepayment - approvedAmount;
      const processingFee = Math.round(approvedAmount * 0.02);

      sanctionData = {
        approvedAmount,
        tenure,
        interestRate,
        emi,
        processingFee,
        totalInterest,
        totalRepayment,
        validity: 15,
        dateOfIssue: new Date(Date.now() - randomNumber(0, 30) * 24 * 60 * 60 * 1000).toISOString(),
      };
    }

    const applicationData = {
      name,
      age,
      employmentType,
      monthlyIncome,
      existingEMI,
      loanAmount,
      city,
      phone,
      tenure,
      loanPurpose,
      creditScore,
      eligibilityResult: {
        maxEligibleLoan: Math.round(maxEligibleLoan),
        emiToIncomeRatio,
        justification: rejectionReason || 'Loan approved based on eligibility criteria.',
      },
    };

    // Save with random past timestamp
    const appId = saveApplication(applicationData, status, sanctionData, rejectionReason);
    applications.push(appId);
  }

  return applications;
}
