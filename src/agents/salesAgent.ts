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

class SalesAgent {
  async process(data: ApplicationData): Promise<ProcessResult> {
    const responses: Response[] = [];
    const applicationData = { ...data };

    // Start Sales Agent Flow
    responses.push({
      content: `🎯 **Sales Agent Here!**\n\nHello ${applicationData.name}! Let me explain our loan benefits:\n\n✅ **Quick Processing:** Approval within 24-48 hours\n✅ **Flexible Tenure:** 6 to 60 months\n✅ **Competitive Rates:** Starting from 12% per annum\n✅ **Minimal Documentation:** Easy online process\n✅ **No Hidden Charges:** Transparent terms\n\nBefore we proceed, may I know the primary purpose for this loan?\n(e.g., medical, education, business, wedding, home renovation, debt consolidation, etc.)`,
    });

    applicationData.stage = 'sales_collect_purpose';
    return { responses, applicationData };
  }

  async handleResponse(message: string, data: ApplicationData): Promise<ProcessResult> {
    const responses: Response[] = [];
    const applicationData = { ...data };

    if (applicationData.stage === 'sales_collect_purpose') {
      applicationData.loanPurpose = message;
      applicationData.stage = 'sales_collect_tenure';
      
      responses.push({
        content: `Understood. You need this loan for ${message}.\n\nWhat loan tenure (repayment period) would you prefer?\n\nPlease specify in months (minimum 6 months, maximum 60 months).\nExample: Type "12" for 1 year, "24" for 2 years, etc.`,
      });
      
      return { responses, applicationData };
    }

    if (applicationData.stage === 'sales_collect_tenure') {
      const tenure = parseInt(message);
      if (isNaN(tenure) || tenure < 6 || tenure > 60) {
        responses.push({
          content: 'Please provide a valid tenure between 6 and 60 months.',
          status: 'warning',
        });
        return { responses, applicationData };
      }

      applicationData.tenure = tenure;
      applicationData.stage = 'sales_interest_confirmation';
      
      responses.push({
        content: `Perfect! You\'ve selected a ${tenure}-month repayment period.\n\n💰 **Interest Rate Information:**\nBased on your profile, the applicable interest rate will be between **12% to 18% per annum**.\n\nThe exact rate will be determined after credit assessment based on:\n• Your credit score\n• Income stability\n• Existing obligations\n\nDo you accept these interest rate terms?\nPlease type "Yes" to proceed or "No" to decline.`,
      });
      
      return { responses, applicationData };
    }

    if (applicationData.stage === 'sales_interest_confirmation') {
      const acceptance = message.toLowerCase();
      
      if (acceptance.includes('no') || acceptance.includes('decline')) {
        applicationData.stage = 'rejected';
        responses.push({
          content: 'We understand. Thank you for considering our loan products. If you change your mind, feel free to reach out to us again.\n\nHave a great day!',
          status: 'error',
        });
        return { responses, applicationData };
      }

      if (acceptance.includes('yes') || acceptance.includes('accept') || acceptance.includes('agree')) {
        applicationData.acceptedInterest = true;
        applicationData.stage = 'sales_agent_complete';
        
        responses.push({
          content: `Excellent! You\'ve accepted the interest rate terms.\n\n✅ **Sales Verification Complete**\n\nNow transferring you to our Verification Agent for identity and document validation...`,
          status: 'success',
        });

        return {
          responses,
          applicationData,
        };
      }

      responses.push({
        content: 'Please type "Yes" to accept or "No" to decline.',
        status: 'warning',
      });
      return { responses, applicationData };
    }

    return { responses, applicationData };
  }
}

export const salesAgent = new SalesAgent();
