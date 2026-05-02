export type Role = 'patient' | 'doctor' | 'admin';
export type RequestStatus =
'draft' |
'pending' |
'under_review' |
'approved' |
'denied';

export interface Patient {
  id: string;
  name: string;
  age: number;
  sex: string;
  dob: string;
  email: string;
  phone: string;
}

export interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  refillDate: string;
  paused: boolean;
}

export interface TreatmentPlan {
  medications: Medication[];
  notes: string;
}

export interface MedicalRequest {
  id: string;
  patientId: string;
  condition: string;
  duration: string;
  previousTreatment: string;
  symptoms: string;
  status: RequestStatus;
  submittedAt: string;
  updatedAt: string;
  questionnaire: Record<string, any>;
  treatmentPlan?: TreatmentPlan;
  denialReason?: string;
  refundStatus?: 'pending' | 'processed';
  consultationFee: number;
}

export interface Message {
  id: string;
  requestId: string;
  senderId: string;
  senderName: string;
  senderRole: Role;
  text: string;
  timestamp: string;
  read: boolean;
  attachments?: string[];
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: 'info' | 'success' | 'warning' | 'error';
  link?: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  user: string;
  role: Role;
  action: string;
  details: string;
}

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  license: string;
  status: 'active' | 'suspended' | 'pending_verification';
}