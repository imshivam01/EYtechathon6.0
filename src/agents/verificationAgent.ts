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

class VerificationAgent {
  async process(data: ApplicationData): Promise<ProcessResult> {
    const responses: Response[] = [];
    const applicationData = { ...data };

    responses.push({
      content: '🔍 **Verification Agent Initiated**\n\nValidating your information with our CRM database...',
    });

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Mock verification - In real scenario, this would call actual APIs
    const verificationResult = this.mockCRMVerification(applicationData);

    if (verificationResult.status === 'verified') {
      responses.push({
        content: `✅ **Identity Verification Successful**\n\n• Name: ${applicationData.name} - Verified\n• Phone: ${applicationData.phone} - Verified\n• City: ${applicationData.city} - Verified\n• Employment: ${applicationData.employmentType} - Verified\n\nAll details match our records. Proceeding to credit assessment...`,
        status: 'success',
      });

      applicationData.stage = 'verification_complete';
      
      return {
        responses,
        applicationData,
      };
    } else {
      responses.push({
        content: `⚠️ **Verification Issue Detected**\n\n${verificationResult.message}\n\nPlease contact our support team for manual verification.\n📞 1800-XXX-XXXX`,
        status: 'error',
      });

      applicationData.stage = 'verification_failed';
      return { responses, applicationData };
    }
  }

  private mockCRMVerification(data: ApplicationData): { status: string; message?: string } {
    // Mock verification logic
    // In production, this would call real verification APIs
    
    // Check phone number format
    if (!data.phone || data.phone.length < 10) {
      return {
        status: 'failed',
        message: 'Phone number format is invalid.',
      };
    }

    // Check name
    if (!data.name || data.name.length < 3) {
      return {
        status: 'failed',
        message: 'Name validation failed.',
      };
    }

    // Simulate 95% success rate
    const random = Math.random();
    if (random < 0.95) {
      return { status: 'verified' };
    } else {
      return {
        status: 'failed',
        message: 'Unable to verify details in our database. This may require manual verification.',
      };
    }
  }
}

export const verificationAgent = new VerificationAgent();
