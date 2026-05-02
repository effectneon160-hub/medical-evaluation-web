import React, { useEffect, useState, createContext, useContext } from 'react';
import {
  Role,
  Patient,
  MedicalRequest,
  Message,
  Notification,
  AuditLog,
  Doctor,
  RequestStatus,
  TreatmentPlan } from
'../types';
interface AppContextType {
  currentRole: Role;
  setCurrentRole: (role: Role) => void;
  currentUserId: string;
  patients: Patient[];
  requests: MedicalRequest[];
  messages: Message[];
  notifications: Notification[];
  auditLogs: AuditLog[];
  doctors: Doctor[];
  // Actions
  submitIntake: (data: Partial<MedicalRequest>) => string;
  updateQuestionnaire: (requestId: string, data: Record<string, any>) => void;
  submitPayment: (requestId: string) => void;
  approveRequest: (requestId: string, treatmentPlan: TreatmentPlan) => void;
  denyRequest: (requestId: string, reason: string) => void;
  sendMessage: (
  requestId: string,
  text: string,
  senderId: string,
  senderName: string,
  senderRole: Role)
  => void;
  markNotificationRead: (notificationId: string) => void;
  toggleMedicationPause: (requestId: string, medicationId: string) => void;
  logAudit: (action: string, details: string) => void;
}
const AppContext = createContext<AppContextType | undefined>(undefined);
// Dummy Data Generators
const generateDummyRequests = (): MedicalRequest[] => {
  const conditions = [
  'Erectile Dysfunction',
  'Hair Loss',
  'Testosterone Replacement',
  'Sleep Apnea',
  'Weight Management'];

  const statuses: RequestStatus[] = [
  'pending',
  'approved',
  'denied',
  'under_review'];

  const requests: MedicalRequest[] = [];
  // Mandatory John Carter Request
  requests.push({
    id: 'REQ-001',
    patientId: 'PAT-001',
    condition: 'Erectile Dysfunction',
    duration: '6-12 months',
    previousTreatment: 'Sildenafil 50mg',
    symptoms:
    'Difficulty maintaining erection during intercourse. Occasional morning wood but less frequent.',
    status: 'pending',
    submittedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    questionnaire: {
      exercise: '1-2 times a week',
      diet: 'Average',
      alcohol: '2-3 drinks per week',
      smoking: 'No',
      conditions: ['High Blood Pressure'],
      medications: ['Lisinopril 10mg'],
      severity: 7,
      allergies: 'None'
    },
    consultationFee: 49.0
  });
  // Generate 24 more random requests
  for (let i = 2; i <= 25; i++) {
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const condition = conditions[Math.floor(Math.random() * conditions.length)];
    const daysAgo = Math.floor(Math.random() * 30);
    requests.push({
      id: `REQ-${i.toString().padStart(3, '0')}`,
      patientId: `PAT-${i.toString().padStart(3, '0')}`,
      condition,
      duration: '1-3 years',
      previousTreatment: 'None',
      symptoms: 'Various symptoms related to condition.',
      status,
      submittedAt: new Date(
        Date.now() - daysAgo * 24 * 60 * 60 * 1000
      ).toISOString(),
      updatedAt: new Date(
        Date.now() - (daysAgo - 1) * 24 * 60 * 60 * 1000
      ).toISOString(),
      questionnaire: {
        severity: Math.floor(Math.random() * 10) + 1
      },
      consultationFee: 49.0,
      ...(status === 'approved' ?
      {
        treatmentPlan: {
          medications: [
          {
            id: `MED-${i}`,
            name: condition === 'Hair Loss' ? 'Finasteride' : 'Tadalafil',
            dosage: '5mg',
            frequency: 'Daily',
            refillDate: new Date(
              Date.now() + 30 * 24 * 60 * 60 * 1000
            ).toISOString(),
            paused: false
          }],

          notes: 'Take daily as prescribed. Follow up in 3 months.'
        }
      } :
      {}),
      ...(status === 'denied' ?
      {
        denialReason:
        'Blood pressure medication contraindication. Needs in-person evaluation.',
        refundStatus: 'processed'
      } :
      {})
    });
  }
  return requests;
};
const generateDummyPatients = (): Patient[] => {
  const patients: Patient[] = [
  {
    id: 'PAT-001',
    name: 'John Carter',
    age: 42,
    sex: 'Male',
    dob: '1982-03-15',
    email: 'john.carter@example.com',
    phone: '(555) 123-4567'
  }];

  for (let i = 2; i <= 25; i++) {
    patients.push({
      id: `PAT-${i.toString().padStart(3, '0')}`,
      name: `Patient ${i}`,
      age: 30 + Math.floor(Math.random() * 30),
      sex: Math.random() > 0.5 ? 'Male' : 'Female',
      dob: '1980-01-01',
      email: `patient${i}@example.com`,
      phone: '(555) 000-0000'
    });
  }
  return patients;
};
export const AppProvider: React.FC<{
  children: ReactNode;
}> = ({ children }) => {
  const [currentRole, setCurrentRole] = useState<Role>('patient');
  // IDs based on role
  const currentUserId =
  currentRole === 'patient' ?
  'PAT-001' :
  currentRole === 'doctor' ?
  'DOC-001' :
  'ADM-001';
  const currentUserName =
  currentRole === 'patient' ?
  'John Carter' :
  currentRole === 'doctor' ?
  'Dr. Emily Watson' :
  'System Admin';
  const [patients] = useState<Patient[]>(generateDummyPatients());
  const [requests, setRequests] = useState<MedicalRequest[]>(
    generateDummyRequests()
  );
  const [doctors] = useState<Doctor[]>([
  {
    id: 'DOC-001',
    name: 'Dr. Emily Watson',
    specialty: "Men's Health",
    license: 'MD-2847593',
    status: 'active'
  },
  {
    id: 'DOC-002',
    name: 'Dr. Sarah Chen',
    specialty: 'Dermatology',
    license: 'MD-9384751',
    status: 'active'
  },
  {
    id: 'DOC-003',
    name: 'Dr. James Wilson',
    specialty: 'Endocrinology',
    license: 'MD-1029384',
    status: 'active'
  }]
  );
  const [messages, setMessages] = useState<Message[]>([
  {
    id: 'MSG-001',
    requestId: 'REQ-001',
    senderId: 'PAT-001',
    senderName: 'John Carter',
    senderRole: 'patient',
    text: 'Hello Dr. Watson, I submitted my intake form. Let me know if you need any more information.',
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    read: true
  },
  {
    id: 'MSG-002',
    requestId: 'REQ-001',
    senderId: 'DOC-001',
    senderName: 'Dr. Emily Watson',
    senderRole: 'doctor',
    text: 'Hi John. I am reviewing your file now. Given your current Lisinopril prescription, I need to check your recent BP readings if you have them.',
    timestamp: new Date(Date.now() - 23 * 60 * 60 * 1000).toISOString(),
    read: true
  }]
  );
  const [notifications, setNotifications] = useState<Notification[]>([
  {
    id: 'NOT-001',
    userId: 'PAT-001',
    title: 'Welcome to MedEval',
    message: 'Your account has been created securely.',
    timestamp: new Date().toISOString(),
    read: false,
    type: 'info'
  }]
  );
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([
  {
    id: 'AUD-001',
    timestamp: new Date().toISOString(),
    user: 'System',
    role: 'admin',
    action: 'System Initialization',
    details: 'Platform started and dummy data loaded.'
  }]
  );
  const logAudit = (action: string, details: string) => {
    const newLog: AuditLog = {
      id: `AUD-${Date.now()}`,
      timestamp: new Date().toISOString(),
      user: currentUserName,
      role: currentRole,
      action,
      details
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  };
  const notifyUser = (
  userId: string,
  title: string,
  message: string,
  type: Notification['type'] = 'info') =>
  {
    const newNotif: Notification = {
      id: `NOT-${Date.now()}`,
      userId,
      title,
      message,
      timestamp: new Date().toISOString(),
      read: false,
      type
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };
  const submitIntake = (data: Partial<MedicalRequest>) => {
    const newRequestId = `REQ-${Date.now()}`;
    const newRequest: MedicalRequest = {
      id: newRequestId,
      patientId: 'PAT-001',
      condition: data.condition || '',
      duration: data.duration || '',
      previousTreatment: data.previousTreatment || '',
      symptoms: data.symptoms || '',
      status: 'draft',
      submittedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      questionnaire: {},
      consultationFee: 49.0
    };
    setRequests((prev) => [newRequest, ...prev]);
    logAudit(
      'Intake Started',
      `Patient PAT-001 started intake for ${data.condition}`
    );
    return newRequestId;
  };
  const updateQuestionnaire = (
  requestId: string,
  data: Record<string, any>) =>
  {
    setRequests((prev) =>
    prev.map((req) =>
    req.id === requestId ?
    {
      ...req,
      questionnaire: {
        ...req.questionnaire,
        ...data
      },
      updatedAt: new Date().toISOString()
    } :
    req
    )
    );
  };
  const submitPayment = (requestId: string) => {
    setRequests((prev) =>
    prev.map((req) =>
    req.id === requestId ?
    {
      ...req,
      status: 'pending',
      updatedAt: new Date().toISOString()
    } :
    req
    )
    );
    logAudit(
      'Request Submitted',
      `Patient PAT-001 submitted request ${requestId} for medical review`
    );
    notifyUser(
      'DOC-001',
      'New Patient Request',
      'A new medical request is pending your review.',
      'info'
    );
  };
  const approveRequest = (requestId: string, treatmentPlan: TreatmentPlan) => {
    setRequests((prev) =>
    prev.map((req) => {
      if (req.id === requestId) {
        notifyUser(
          req.patientId,
          'Treatment Approved',
          'Your medical request has been approved. View your treatment plan.',
          'success'
        );
        return {
          ...req,
          status: 'approved',
          treatmentPlan,
          updatedAt: new Date().toISOString()
        };
      }
      return req;
    })
    );
    logAudit('Request Approved', `Doctor DOC-001 approved request ${requestId}`);
  };
  const denyRequest = (requestId: string, reason: string) => {
    setRequests((prev) =>
    prev.map((req) => {
      if (req.id === requestId) {
        notifyUser(
          req.patientId,
          'Request Denied',
          'Your medical request was not approved. A refund has been initiated.',
          'error'
        );
        return {
          ...req,
          status: 'denied',
          denialReason: reason,
          refundStatus: 'pending',
          updatedAt: new Date().toISOString()
        };
      }
      return req;
    })
    );
    logAudit(
      'Request Denied',
      `Doctor DOC-001 denied request ${requestId}. Reason: ${reason}`
    );
  };
  const sendMessage = (
  requestId: string,
  text: string,
  senderId: string,
  senderName: string,
  senderRole: Role) =>
  {
    const newMsg: Message = {
      id: `MSG-${Date.now()}`,
      requestId,
      senderId,
      senderName,
      senderRole,
      text,
      timestamp: new Date().toISOString(),
      read: false
    };
    setMessages((prev) => [...prev, newMsg]);
    // Notify the other party
    const request = requests.find((r) => r.id === requestId);
    if (request) {
      const recipientId =
      senderRole === 'patient' ? 'DOC-001' : request.patientId;
      notifyUser(
        recipientId,
        'New Message',
        `You have a new message from ${senderName}`,
        'info'
      );
    }
  };
  const markNotificationRead = (notificationId: string) => {
    setNotifications((prev) =>
    prev.map((n) =>
    n.id === notificationId ?
    {
      ...n,
      read: true
    } :
    n
    )
    );
  };
  const toggleMedicationPause = (requestId: string, medicationId: string) => {
    setRequests((prev) =>
    prev.map((req) => {
      if (req.id === requestId && req.treatmentPlan) {
        const updatedMeds = req.treatmentPlan.medications.map((med) =>
        med.id === medicationId ?
        {
          ...med,
          paused: !med.paused
        } :
        med
        );
        const action = updatedMeds.find((m) => m.id === medicationId)?.paused ?
        'paused' :
        'resumed';
        logAudit(
          'Medication Toggled',
          `Patient toggled medication ${medicationId} to ${action}`
        );
        return {
          ...req,
          treatmentPlan: {
            ...req.treatmentPlan,
            medications: updatedMeds
          }
        };
      }
      return req;
    })
    );
  };
  return (
    <AppContext.Provider
      value={{
        currentRole,
        setCurrentRole,
        currentUserId,
        patients,
        requests,
        messages,
        notifications,
        auditLogs,
        doctors,
        submitIntake,
        updateQuestionnaire,
        submitPayment,
        approveRequest,
        denyRequest,
        sendMessage,
        markNotificationRead,
        toggleMedicationPause,
        logAudit
      }}>
      
      {children}
    </AppContext.Provider>);

};
export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};