export interface ApplicationRecord {
  id: string;
  data: {
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
    creditScore?: number;
    eligibilityResult?: any;
  };
  status: 'pending' | 'approved' | 'rejected';
  sanctionData?: any;
  rejectionReason?: string;
  createdAt: string;
  updatedAt: string;
}

const STORAGE_KEY = 'nbfc_applications';

export function saveApplication(
  applicationData: any,
  status: 'pending' | 'approved' | 'rejected',
  sanctionData?: any,
  rejectionReason?: string
): string {
  // Generate unique ID
  const id = `APP-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

  const application: ApplicationRecord = {
    id,
    data: applicationData,
    status,
    sanctionData,
    rejectionReason,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  // Get existing applications
  const applications = getAllApplications();

  // Add new application
  applications.push(application);

  // Save to localStorage
  localStorage.setItem(STORAGE_KEY, JSON.stringify(applications));

  return id;
}

export function getAllApplications(): ApplicationRecord[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return [];
    return JSON.parse(data);
  } catch (error) {
    console.error('Error loading applications:', error);
    return [];
  }
}

export function getApplicationById(id: string): ApplicationRecord | null {
  const applications = getAllApplications();
  return applications.find((app) => app.id === id) || null;
}

export function updateApplication(id: string, updates: Partial<ApplicationRecord>): boolean {
  try {
    const applications = getAllApplications();
    const index = applications.findIndex((app) => app.id === id);

    if (index === -1) return false;

    applications[index] = {
      ...applications[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(applications));
    return true;
  } catch (error) {
    console.error('Error updating application:', error);
    return false;
  }
}

export function deleteApplication(id: string): boolean {
  try {
    const applications = getAllApplications();
    const filtered = applications.filter((app) => app.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    return true;
  } catch (error) {
    console.error('Error deleting application:', error);
    return false;
  }
}
