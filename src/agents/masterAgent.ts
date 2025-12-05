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
  triggerAgent?: string;
  sanctionData?: any;
}

class MasterAgent {
  async process(message: string, currentData: ApplicationData): Promise<ProcessResult> {
    const responses: Response[] = [];
    const applicationData = { ...currentData };

    // Stage: Greeting - Collect Name
    if (applicationData.stage === 'greeting') {
      applicationData.name = message;
      applicationData.stage = 'collect_age';
      responses.push({
        content: `Thank you, ${message}! Nice to meet you.\n\nMay I know your age?`,
      });
      return { responses, applicationData };
    }

    // Stage: Collect Age
    if (applicationData.stage === 'collect_age') {
      const age = parseInt(message);
      if (isNaN(age) || age < 18 || age > 100) {
        responses.push({
          content: 'Please provide a valid age between 18 and 100.',
          status: 'warning',
        });
        return { responses, applicationData };
      }

      if (age < 21) {
        applicationData.stage = 'rejected';
        responses.push({
          content: `I apologize, but we require applicants to be at least 21 years old. Unfortunately, we cannot proceed with your application at this time.\n\nYou may reapply once you meet the age criteria.\n\nThank you for your interest.`,
          status: 'error',
        });
        return { responses, applicationData };
      }

      applicationData.age = age;
      applicationData.stage = 'collect_employment';
      responses.push({
        content: 'Great! Now, what is your employment type?\n\nPlease type:\n• "Salaried" if you are employed\n• "Self-employed" if you run your own business',
      });
      return { responses, applicationData };
    }

    // Stage: Collect Employment Type
    if (applicationData.stage === 'collect_employment') {
      const employment = message.toLowerCase();
      if (employment.includes('salaried')) {
        applicationData.employmentType = 'Salaried';
      } else if (employment.includes('self') || employment.includes('business')) {
        applicationData.employmentType = 'Self-employed';
      } else if (employment.includes('unemployed') || employment.includes('no')) {
        applicationData.stage = 'rejected';
        responses.push({
          content: 'I apologize, but we require applicants to have a stable source of income. Unfortunately, we cannot proceed with your application at this time.\n\nThank you for your interest.',
          status: 'error',
        });
        return { responses, applicationData };
      } else {
        responses.push({
          content: 'Please specify either "Salaried" or "Self-employed".',
          status: 'warning',
        });
        return { responses, applicationData };
      }

      applicationData.stage = 'collect_income';
      responses.push({
        content: `Perfect! You are ${applicationData.employmentType}.\n\nWhat is your monthly income? (in ₹)`,
      });
      return { responses, applicationData };
    }

    // Stage: Collect Income
    if (applicationData.stage === 'collect_income') {
      const income = parseFloat(message.replace(/[₹,]/g, ''));
      if (isNaN(income) || income <= 0) {
        responses.push({
          content: 'Please provide a valid income amount in numbers (e.g., 50000).',
          status: 'warning',
        });
        return { responses, applicationData };
      }

      if (income < 15000) {
        applicationData.stage = 'rejected';
        responses.push({
          content: `I apologize, but we require a minimum monthly income of ₹15,000. Unfortunately, with an income of ₹${income.toLocaleString('en-IN')}, we cannot proceed with your application.\n\nThank you for your interest.`,
          status: 'error',
        });
        return { responses, applicationData };
      }

      applicationData.monthlyIncome = income;
      applicationData.stage = 'collect_existing_emi';
      responses.push({
        content: 'Excellent! Your income qualifies for our loan products.\n\nDo you have any existing EMIs (loan repayments)? If yes, what is your total monthly EMI amount? If no, please type "0".',
      });
      return { responses, applicationData };
    }

    // Stage: Collect Existing EMI
    if (applicationData.stage === 'collect_existing_emi') {
      const emi = parseFloat(message.replace(/[₹,]/g, ''));
      if (isNaN(emi) || emi < 0) {
        responses.push({
          content: 'Please provide a valid EMI amount or type "0" if you have no existing EMIs.',
          status: 'warning',
        });
        return { responses, applicationData };
      }

      applicationData.existingEMI = emi;
      applicationData.stage = 'collect_loan_amount';
      responses.push({
        content: emi > 0
          ? `Noted. You have an existing EMI of ₹${emi.toLocaleString('en-IN')} per month.\n\nHow much loan amount are you looking for? (in ₹)`
          : 'Great! You have no existing EMIs.\n\nHow much loan amount are you looking for? (in ₹)',
      });
      return { responses, applicationData };
    }

    // Stage: Collect Loan Amount
    if (applicationData.stage === 'collect_loan_amount') {
      const amount = parseFloat(message.replace(/[₹,]/g, ''));
      if (isNaN(amount) || amount <= 0) {
        responses.push({
          content: 'Please provide a valid loan amount in numbers.',
          status: 'warning',
        });
        return { responses, applicationData };
      }

      if (amount < 10000) {
        responses.push({
          content: 'We offer personal loans starting from ₹10,000. Please enter a higher amount.',
          status: 'warning',
        });
        return { responses, applicationData };
      }

      applicationData.loanAmount = amount;
      applicationData.stage = 'collect_city';
      responses.push({
        content: `You\'re requesting a loan of ₹${amount.toLocaleString('en-IN')}.\n\nWhich city do you reside in?`,
      });
      return { responses, applicationData };
    }

    // Stage: Collect City
    if (applicationData.stage === 'collect_city') {
      applicationData.city = message;
      applicationData.stage = 'collect_phone';
      responses.push({
        content: `Thank you! Location: ${message}.\n\nPlease provide your mobile number for verification.`,
      });
      return { responses, applicationData };
    }

    // Stage: Collect Phone
    if (applicationData.stage === 'collect_phone') {
      const phone = message.replace(/[^0-9]/g, '');
      if (phone.length < 10) {
        responses.push({
          content: 'Please provide a valid 10-digit mobile number.',
          status: 'warning',
        });
        return { responses, applicationData };
      }

      applicationData.phone = phone;
      applicationData.stage = 'data_collection_complete';
      
      responses.push({
        content: `Perfect! I have collected all the mandatory information.\n\n📋 **Application Summary:**\n• Name: ${applicationData.name}\n• Age: ${applicationData.age}\n• Employment: ${applicationData.employmentType}\n• Monthly Income: ₹${applicationData.monthlyIncome?.toLocaleString('en-IN')}\n• Existing EMI: ₹${applicationData.existingEMI?.toLocaleString('en-IN')}\n• Loan Required: ₹${applicationData.loanAmount?.toLocaleString('en-IN')}\n• City: ${applicationData.city}\n• Phone: ${phone}\n\nLet me now connect you with our Sales Agent to discuss loan benefits and terms.`,
        status: 'success',
      });

      return {
        responses,
        applicationData,
        triggerAgent: 'sales',
      };
    }

    // Default fallback
    responses.push({
      content: 'I didn\'t quite understand that. Could you please rephrase?',
    });
    return { responses, applicationData };
  }
}

export const masterAgent = new MasterAgent();
