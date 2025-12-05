import { calculateEMI } from '../utils/loanCalculations';

interface ApplicationData {
  stage: string;
  name?: string;
  age?: number;
  employmentType?: string;
  monthlyIncome?: number;
  existingEMI?: number;
  loanAmount?: number;
  city?: string;
  phone?: string;
  loanPurpose?: string;
  tenure?: number;
  acceptedInterest?: boolean;
  creditScore?: number;
  eligibilityResult?: any;
}

interface Response {
  content: string;
  status?: 'success' | 'error' | 'warning';
}

interface ProcessResult {
  responses: Response[];
  applicationData: ApplicationData;
  sanctionData?: any;
}

class SanctionAgent {
  async process(data: ApplicationData): Promise<ProcessResult> {
    const responses: Response[] = [];
    const applicationData = { ...data };

    responses.push({
      content: '📄 **Sanction Agent Initiated**\n\nGenerating your sanction letter...',
    });

    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Determine interest rate based on credit score
    const interestRate = this.determineInterestRate(applicationData.creditScore!);
    
    // Calculate EMI and other details
    const approvedAmount = applicationData.eligibilityResult.approvedAmount;
    const tenure = applicationData.tenure!;
    const emi = calculateEMI(approvedAmount, interestRate, tenure);
    const processingFee = Math.round(approvedAmount * 0.02); // 2% processing fee
    const totalRepayment = emi * tenure;
    const totalInterest = totalRepayment - approvedAmount;

    const sanctionData = {
      approvedAmount,
      tenure,
      interestRate,
      emi,
      processingFee,
      totalInterest,
      totalRepayment,
      validity: 15, // 15 days validity
      dateOfIssue: new Date().toISOString(),
    };

    responses.push({
      content: `✅ **Sanction Letter Generated Successfully!**\n\nDear ${applicationData.name},\n\nCongratulations! Your personal loan has been sanctioned.\n\n**Loan Summary:**\n• Sanctioned Amount: ₹${approvedAmount.toLocaleString('en-IN')}\n• Tenure: ${tenure} months\n• Interest Rate: ${interestRate}% per annum\n• Monthly EMI: ₹${emi.toLocaleString('en-IN')}\n• Processing Fee: ₹${processingFee.toLocaleString('en-IN')}\n• Total Interest: ₹${totalInterest.toLocaleString('en-IN')}\n• Total Repayment: ₹${totalRepayment.toLocaleString('en-IN')}\n\nYour detailed sanction letter is now ready for download.\n\n🎉 Thank you for choosing our NBFC services!`,
      status: 'success',
    });

    applicationData.stage = 'completed';

    return {
      responses,
      applicationData,
      sanctionData,
    };
  }

  private determineInterestRate(creditScore: number): number {
    // Interest rate based on credit score
    if (creditScore >= 800) return 12.0;
    if (creditScore >= 750) return 13.5;
    if (creditScore >= 700) return 15.0;
    if (creditScore >= 650) return 16.5;
    return 18.0;
  }
}

export const sanctionAgent = new SanctionAgent();
