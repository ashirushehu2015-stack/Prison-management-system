export type SecurityLevel = 'Minimum' | 'Medium' | 'Maximum';

export type InmateStatus = 'Incarcerated' | 'Released' | 'Transferred';

export interface MedicalInvestigation {
  id: string;
  type: string;
  requestDate: string;
  status: 'Pending' | 'Completed' | 'In Review';
  notes: string;
  results?: string;
  investigator?: string;
}

export interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  startDate: string;
  endDate?: string;
  prescribedBy: string;
  status: 'Active' | 'Discontinued';
  purpose: string;
}

export interface Inmate {
  id: string;
  name: string;
  avatarUrl: string;
  dateOfBirth: string;
  securityLevel: SecurityLevel;
  cellBlock: string;
  cellNumber: string;
  status: InmateStatus;
  offenses: string[];
  admissionDate: string;
  releaseDate: string;
  medicalNotes: string;
  behaviorScore: number; // 0-100
  caseNotes: string;
  medicalInvestigations?: MedicalInvestigation[];
  medications?: Medication[];
}

export interface Cell {
  id: string; // e.g., "A-101"
  block: string; // "A" | "B" | "C"
  number: string; // "101", "102"
  capacity: number;
  currentOccupants: string[]; // Inmate IDs
  securityLevel: SecurityLevel;
  status: 'Active' | 'Maintenance' | 'Locked Down';
}

export interface Guard {
  id: string;
  name: string;
  badgeNumber: string;
  rank: 'Officer' | 'Sergeant' | 'Lieutenant' | 'Captain';
  shift: 'Morning' | 'Swing' | 'Night';
  assignedBlock: string;
  status: 'Active' | 'On Leave' | 'Suspended';
  phone: string;
}

export interface Visit {
  id: string;
  inmateId: string;
  inmateName: string;
  visitorName: string;
  relationship: string;
  visitDate: string;
  startTime: string;
  endTime: string;
  status: 'Approved' | 'Pending' | 'Completed' | 'Denied';
  notes?: string;
}

export interface Incident {
  id: string;
  title: string;
  date: string;
  time: string;
  severity: 'Low' | 'Medium' | 'High';
  location: string;
  involvedInmateIds: string[];
  reportingGuardId: string;
  description: string;
  actionsTaken: string;
  status: 'Under Investigation' | 'Resolved' | 'Closed';
}

export interface AIRehabPlan {
  riskAssessment: {
    recidivismRisk: 'Low' | 'Medium' | 'High';
    escapeRisk: 'Low' | 'Medium' | 'High';
    violenceRisk: 'Low' | 'Medium' | 'High';
    justification: string;
  };
  recommendedPrograms: Array<{
    name: string;
    description: string;
    frequency: string;
    goal: string;
  }>;
  behavioralGoals: string[];
  housingRecommendation: string;
  releasePreparation: string;
}

export type UserRole = 'Admin' | 'Warden' | 'Guard' | 'Visitor Desk' | 'Medical';

export interface UserAccount {
  id: string;
  username: string;
  name: string;
  role: UserRole;
  email: string;
  avatarUrl?: string;
  lastActive?: string;
  status: 'Active' | 'Suspended';
  password?: string;
}

