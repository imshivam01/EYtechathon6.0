import { calculateEligibility } from '../utils/loanCalculations';

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
}

class UnderwritingAgent {
  async process(data: ApplicationData): Promise<ProcessResult> {
    const responses: Response[] = [];
    const applicationData = { ...data };

    responses.push({
      content: '📊 **Underwriting Agent Initiated**\n\nPerforming credit assessment and eligibility check...',
    });

    // Simulate credit score fetch
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Generate mock credit score
    const creditScore = this.generateMockCreditScore(applicationData);
    applicationData.creditScore = creditScore;

    responses.push({
      content: `🔢 **Credit Score Retrieved:** ${creditScore}\n\nAnalyzing your financial profile...`,
    });

    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Calculate eligibility
    const eligibility = calculateEligibility(
      applicationData.monthlyIncome!,
      applicationData.existingEMI!,
      applicationData.loanAmount!,
      applicationData.tenure!,
      creditScore
    );

    applicationData.eligibilityResult = eligibility;

    // Determine approval decision
    if (eligibility.decision === 'approved') {
      responses.push({
        content: `✅ **Loan Approved!**\n\n🎉 Congratulations ${applicationData.name}!\n\n**Eligibility Assessment:**\n• Credit Score: ${creditScore} - ${this.getCreditScoreLabel(creditScore)}\n• Requested Amount: ₹${applicationData.loanAmount?.toLocaleString('en-IN')}\n• Approved Amount: ₹${eligibility.approvedAmount.toLocaleString('en-IN')}\n• Max Eligible Limit: ₹${eligibility.maxEligibleLoan.toLocaleString('en-IN')}\n• Income-to-EMI Ratio: ${eligibility.emiToIncomeRatio.toFixed(1)}%\n\n**Justification:**\n${eligibility.justification}\n\nProceeding to sanction letter generation...`,
        status: 'success',
      });

      applicationData.stage = 'underwriting_approved';
      
      return {
        responses,
        applicationData,
      };

    } else if (eligibility.decision === 'approved_reduced') {
      responses.push({
        content: `⚠️ **Loan Approved with Revised Amount**\n\n${applicationData.name}, based on your financial assessment:\n\n**Eligibility Assessment:**\n• Credit Score: ${creditScore} - ${this.getCreditScoreLabel(creditScore)}\n• Requested Amount: ₹${applicationData.loanAmount?.toLocaleString('en-IN')}\n• Approved Amount: ₹${eligibility.approvedAmount.toLocaleString('en-IN')}\n• Max Eligible Limit: ₹${eligibility.maxEligibleLoan.toLocaleString('en-IN')}\n• Income-to-EMI Ratio: ${eligibility.emiToIncomeRatio.toFixed(1)}%\n\n**Justification:**\n${eligibility.justification}\n\nWe can approve a reduced loan amount that better matches your repayment capacity.\n\nProceeding to sanction letter generation...`,
        status: 'warning',
      });

      applicationData.stage = 'underwriting_approved';
      
      return {
        responses,
        applicationData,
      };

    } else {
      // Rejected
      responses.push({
        content: `❌ **Loan Application Declined**\n\nDear ${applicationData.name}, we regret to inform you that we cannot approve your loan application at this time.\n\n**Assessment Details:**\n• Credit Score: ${creditScore} - ${this.getCreditScoreLabel(creditScore)}\n• Requested Amount: ₹${applicationData.loanAmount?.toLocaleString('en-IN')}\n• Max Eligible Limit: ₹${eligibility.maxEligibleLoan.toLocaleString('en-IN')}\n• Income-to-EMI Ratio: ${eligibility.emiToIncomeRatio.toFixed(1)}%\n\n**Reason for Decline:**\n${eligibility.justification}\n\n**Recommendations:**\n• Improve your credit score (aim for 700+)\n• Reduce existing EMI obligations\n• Consider requesting a lower loan amount\n• Increase your monthly income\n\nYou may reapply after 3 months. For queries, contact: 1800-XXX-XXXX`,
        status: 'error',
      });

      applicationData.stage = 'underwriting_rejected';
      
      return {
        responses,
        applicationData,
      };
    }
  }

  private generateMockCreditScore(data: ApplicationData): number {
    // Mock credit score generation based on profile
    let baseScore = 700;

    // Adjust based on income
    if (data.monthlyIncome! >= 50000) baseScore += 50;
    else if (data.monthlyIncome! >= 30000) baseScore += 30;
    else if (data.monthlyIncome! < 20000) baseScore -= 30;

    // Adjust based on existing EMI
    const emiToIncomeRatio = (data.existingEMI! / data.monthlyIncome!) * 100;
    if (emiToIncomeRatio > 40) baseScore -= 50;
    else if (emiToIncomeRatio > 30) baseScore -= 30;
    else if (emiToIncomeRatio === 0) baseScore += 20;

    // Adjust based on employment
    if (data.employmentType === 'Salaried') baseScore += 20;

    // Add some randomness
    const random = Math.floor(Math.random() * 100) - 50;
    baseScore += random;

    // Ensure score is within valid range
    return Math.max(300, Math.min(900, baseScore));
  }

  private getCreditScoreLabel(score: number): string {
    if (score >= 750) return 'Excellent';
    if (score >= 700) return 'Good';
    if (score >= 650) return 'Fair';
    return 'Poor';
  }
}

export const underwritingAgent = new UnderwritingAgent();
