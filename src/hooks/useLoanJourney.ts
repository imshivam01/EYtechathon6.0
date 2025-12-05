import { useState } from 'react';
import { masterAgent } from '../agents/masterAgent';
import { salesAgent } from '../agents/salesAgent';
import { verificationAgent } from '../agents/verificationAgent';
import { underwritingAgent } from '../agents/underwritingAgent';
import { sanctionAgent } from '../agents/sanctionAgent';
import { saveApplication } from '../utils/applicationStorage';

interface Message {
  id: string;
  type: 'bot' | 'user';
  content: string;
  status?: 'success' | 'error' | 'warning';
  metadata?: Record<string, any>;
}

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

interface SanctionData {
  approvedAmount: number;
  tenure: number;
  interestRate: number;
  emi: number;
  processingFee: number;
  totalInterest: number;
  totalRepayment: number;
  validity: number;
}

export function useLoanJourney() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'bot',
      content: 'Welcome to our NBFC Loan Assistance System! 🏦\n\nI\'m here to help you with your personal loan application. We offer quick processing and competitive interest rates.\n\nTo get started, may I have your full name?',
      metadata: { timestamp: new Date().toISOString() },
    },
  ]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [applicationData, setApplicationData] = useState<ApplicationData>({
    stage: 'greeting',
  });
  const [sanctionData, setSanctionData] = useState<SanctionData | null>(null);
  const [showSanctionLetter, setShowSanctionLetter] = useState(false);
  const [applicationId, setApplicationId] = useState<string | null>(null);

  const addMessage = (content: string, type: 'bot' | 'user', status?: 'success' | 'error' | 'warning') => {
    const newMessage: Message = {
      id: Date.now().toString() + Math.random(),
      type,
      content,
      status,
      metadata: { timestamp: new Date().toISOString() },
    };
    setMessages((prev) => [...prev, newMessage]);
  };

  const handleUserMessage = async (message: string) => {
    // Add user message
    addMessage(message, 'user');
    setIsProcessing(true);

    // Simulate processing delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    try {
      let result;

      // Route to appropriate agent based on stage
      if (applicationData.stage.startsWith('sales_')) {
        result = await salesAgent.handleResponse(message, applicationData);
        
        // Update application data
        setApplicationData(result.applicationData);

        // Add bot responses
        for (const response of result.responses) {
          addMessage(response.content, 'bot', response.status);
          await new Promise((resolve) => setTimeout(resolve, 300));
        }

        // Trigger verification agent if sales is complete
        if (result.applicationData.stage === 'sales_agent_complete') {
          await handleWorkerAgent('verification', result.applicationData);
        }
        
        // Save rejected applications from sales agent
        if (result.applicationData.stage === 'rejected' && result.applicationData.name) {
          const rejectionMsg = result.responses[result.responses.length - 1]?.content || 'Application rejected';
          const appId = saveApplication(
            result.applicationData,
            'rejected',
            null,
            rejectionMsg
          );
          setApplicationId(appId);
          addMessage(
            `\nYour application ID is: ${appId}\n\nYou can contact our support team with this ID for any queries.`,
            'bot'
          );
        }
      } else {
        // Process through Master Agent
        result = await masterAgent.process(message, applicationData);
        
        // Update application data
        setApplicationData(result.applicationData);

        // Add bot responses
        for (const response of result.responses) {
          addMessage(response.content, 'bot', response.status);
          await new Promise((resolve) => setTimeout(resolve, 300));
        }

        // Handle worker agents
        if (result.triggerAgent) {
          await handleWorkerAgent(result.triggerAgent, result.applicationData);
        }
        
        // Save rejected applications from master agent
        if (result.applicationData.stage === 'rejected' && result.applicationData.name) {
          const rejectionMsg = result.responses[result.responses.length - 1]?.content || 'Application rejected';
          const appId = saveApplication(
            result.applicationData,
            'rejected',
            null,
            rejectionMsg
          );
          setApplicationId(appId);
          addMessage(
            `\nYour application ID is: ${appId}\n\nYou can contact our support team with this ID for any queries.`,
            'bot'
          );
        }
      }

    } catch (error) {
      addMessage('I apologize for the technical difficulty. Please try again.', 'bot', 'error');
    }

    setIsProcessing(false);
  };

  const handleWorkerAgent = async (agentType: string, data: ApplicationData) => {
    await new Promise((resolve) => setTimeout(resolve, 500));

    let result;

    switch (agentType) {
      case 'sales':
        result = await salesAgent.process(data);
        break;
      case 'verification':
        result = await verificationAgent.process(data);
        
        // Update state with verification result
        setApplicationData(result.applicationData);
        
        // Add responses
        for (const response of result.responses) {
          addMessage(response.content, 'bot', response.status);
          await new Promise((resolve) => setTimeout(resolve, 300));
        }
        
        // Trigger underwriting if verification passed
        if (result.applicationData.stage === 'verification_complete') {
          await handleWorkerAgent('underwriting', result.applicationData);
        }
        return;
        
      case 'underwriting':
        result = await underwritingAgent.process(data);
        
        // Update state with underwriting result
        setApplicationData(result.applicationData);
        
        // Add responses
        for (const response of result.responses) {
          addMessage(response.content, 'bot', response.status);
          await new Promise((resolve) => setTimeout(resolve, 300));
        }
        
        // Save application if rejected
        if (result.applicationData.stage === 'underwriting_rejected') {
          const appId = saveApplication(
            result.applicationData,
            'rejected',
            null,
            result.applicationData.eligibilityResult?.justification
          );
          setApplicationId(appId);
          addMessage(
            `\nYour application ID is: ${appId}\n\nYou can contact our support team with this ID for any queries.`,
            'bot'
          );
        }
        
        // Trigger sanction agent if approved
        if (result.applicationData.stage === 'underwriting_approved') {
          await handleWorkerAgent('sanction', result.applicationData);
        }
        return;
        
      case 'sanction':
        result = await sanctionAgent.process(data);
        
        // Update state with sanction result
        setApplicationData(result.applicationData);
        
        // Add responses
        for (const response of result.responses) {
          addMessage(response.content, 'bot', response.status);
          await new Promise((resolve) => setTimeout(resolve, 300));
        }
        
        // Save application if approved
        if (result.sanctionData) {
          const appId = saveApplication(
            result.applicationData,
            'approved',
            result.sanctionData
          );
          setApplicationId(appId);
          setSanctionData(result.sanctionData);
          setShowSanctionLetter(true);
          
          addMessage(
            `\n📋 Your application ID is: ${appId}\n\nPlease keep this ID for future reference.`,
            'bot'
          );
        }
        return;
        
      default:
        return;
    }

    // Add agent responses (for sales agent initial trigger)
    for (const response of result.responses) {
      addMessage(response.content, 'bot', response.status);
      await new Promise((resolve) => setTimeout(resolve, 300));
    }

    // Update application data
    setApplicationData(result.applicationData);

    // Handle sanction data
    if (result.sanctionData) {
      setSanctionData(result.sanctionData);
      setShowSanctionLetter(true);
    }
  };

  return {
    messages,
    isProcessing,
    applicationData,
    sanctionData,
    showSanctionLetter,
    handleUserMessage,
  };
}