import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Plus,
  Video,
  FileText,
  Pill,
  PauseCircle,
  PlayCircle,
  Clock,
  Calendar } from
'lucide-react';
import { useAppContext } from '../../context/AppContext';
import { StatusBadge } from '../../components/StatusBadge';
import { ChatPanel } from '../../components/ChatPanel';
export const PatientDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { currentUserId, patients, requests, toggleMedicationPause } =
  useAppContext();
  const patient = patients.find((p) => p.id === currentUserId);
  const patientRequests = requests.
  filter((r) => r.patientId === currentUserId).
  sort(
    (a, b) =>
    new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );
  const activeRequest = patientRequests[0]; // Most recent request
  if (!patient || !activeRequest) return <div>Loading...</div>;
  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Welcome back, {patient.name.split(' ')[0]}
          </h1>
          <p className="text-slate-500">
            Manage your medical requests and treatments.
          </p>
        </div>
        <button
          onClick={() => navigate('/patient/intake')}
          className="bg-medical-blue hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors shadow-sm w-fit">
          
          <Plus size={18} />
          New Consultation
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Status & Treatment */}
        <div className="lg:col-span-2 space-y-8">
          {/* Active Request Status Card */}
          <motion.div
            initial={{
              opacity: 0,
              y: 20
            }}
            animate={{
              opacity: 1,
              y: 0
            }}
            className="bg-white rounded-2xl shadow-card border border-slate-200 overflow-hidden">
            
            <div className="p-6 border-b border-slate-100 flex justify-between items-start">
              <div>
                <h2 className="text-lg font-semibold text-slate-900 mb-1">
                  Current Request: {activeRequest.condition}
                </h2>
                <p className="text-sm text-slate-500">
                  Submitted on{' '}
                  {new Date(activeRequest.submittedAt).toLocaleDateString()}
                </p>
              </div>
              <StatusBadge status={activeRequest.status} size="lg" />
            </div>

            {/* Status Timeline */}
            <div className="p-6 bg-slate-50/50">
              <div className="relative flex justify-between items-center max-w-md mx-auto">
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-slate-200 rounded-full z-0"></div>

                {/* Timeline Logic */}
                {['pending', 'under_review', 'decision'].map((step, idx) => {
                  let isActive = false;
                  let isPast = false;
                  if (step === 'pending') {
                    isActive = activeRequest.status === 'pending';
                    isPast = ['under_review', 'approved', 'denied'].includes(
                      activeRequest.status
                    );
                  } else if (step === 'under_review') {
                    isActive = activeRequest.status === 'under_review';
                    isPast = ['approved', 'denied'].includes(
                      activeRequest.status
                    );
                  } else {
                    isActive = ['approved', 'denied'].includes(
                      activeRequest.status
                    );
                  }
                  return (
                    <div
                      key={step}
                      className="relative z-10 flex flex-col items-center gap-2">
                      
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-colors ${isActive ? 'bg-white border-medical-blue text-medical-blue' : isPast ? 'bg-medical-blue border-medical-blue text-white' : 'bg-white border-slate-300 text-slate-300'}`}>
                        
                        {isPast ?
                        <CheckCircle size={16} /> :

                        <span className="text-sm font-bold">{idx + 1}</span>
                        }
                      </div>
                      <span
                        className={`text-xs font-medium ${isActive || isPast ? 'text-slate-900' : 'text-slate-400'}`}>
                        
                        {step === 'decision' ?
                        activeRequest.status === 'denied' ?
                        'Denied' :
                        activeRequest.status === 'approved' ?
                        'Approved' :
                        'Decision' :
                        step === 'under_review' ?
                        'Under Review' :
                        'Submitted'}
                      </span>
                    </div>);

                })}
              </div>

              {activeRequest.status === 'denied' &&
              <div className="mt-6 p-4 bg-red-50 border border-red-100 rounded-xl">
                  <h4 className="text-red-800 font-medium mb-1">
                    Request Not Approved
                  </h4>
                  <p className="text-sm text-red-700 mb-2">
                    Reason: {activeRequest.denialReason}
                  </p>
                  <p className="text-xs font-medium text-red-600">
                    Refund Status:{' '}
                    {activeRequest.refundStatus === 'processed' ?
                  'Processed' :
                  'Pending'}
                  </p>
                </div>
              }
            </div>
          </motion.div>

          {/* Treatment Section (If Approved) */}
          {activeRequest.status === 'approved' &&
          activeRequest.treatmentPlan &&
          <motion.div
            initial={{
              opacity: 0,
              y: 20
            }}
            animate={{
              opacity: 1,
              y: 0
            }}
            transition={{
              delay: 0.1
            }}
            className="space-y-4">
            
                <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                  <Pill className="text-medical-blue" />
                  Active Prescriptions
                </h3>

                <div className="grid grid-cols-1 gap-4">
                  {activeRequest.treatmentPlan.medications.map((med) =>
              <div
                key={med.id}
                className={`bg-white rounded-xl shadow-sm border p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 transition-all ${med.paused ? 'border-slate-200 opacity-75' : 'border-emerald-200'}`}>
                
                      <div className="flex items-start gap-4">
                        <div
                    className={`p-3 rounded-lg ${med.paused ? 'bg-slate-100 text-slate-500' : 'bg-emerald-50 text-emerald-600'}`}>
                    
                          <Pill size={24} />
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-900 text-lg flex items-center gap-2">
                            {med.name}
                            {med.paused &&
                      <span className="text-xs font-medium bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
                                Paused
                              </span>
                      }
                          </h4>
                          <p className="text-slate-600 text-sm mt-0.5">
                            {med.dosage} • {med.frequency}
                          </p>
                          <div className="flex items-center gap-1.5 mt-2 text-xs font-medium text-slate-500">
                            <Calendar size={14} />
                            Next refill:{' '}
                            {new Date(med.refillDate).toLocaleDateString()}
                          </div>
                        </div>
                      </div>

                      <button
                  onClick={() =>
                  toggleMedicationPause(activeRequest.id, med.id)
                  }
                  className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors ${med.paused ? 'bg-medical-blue text-white hover:bg-blue-700' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}>
                  
                        {med.paused ?
                  <>
                            <PlayCircle size={16} /> Resume
                          </> :

                  <>
                            <PauseCircle size={16} /> Pause
                          </>
                  }
                      </button>
                    </div>
              )}
                </div>

                {/* Doctor's Notes */}
                <div className="bg-blue-50 border border-blue-100 rounded-xl p-5 mt-4">
                  <h4 className="font-semibold text-blue-900 flex items-center gap-2 mb-2">
                    <FileText size={18} />
                    Doctor's Instructions
                  </h4>
                  <p className="text-sm text-blue-800 leading-relaxed">
                    {activeRequest.treatmentPlan.notes}
                  </p>
                </div>
              </motion.div>
          }
        </div>

        {/* Right Column - Actions & Chat */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="bg-white rounded-2xl shadow-card border border-slate-200 p-5">
            <h3 className="font-semibold text-slate-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button className="w-full flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:border-medical-blue hover:bg-blue-50 transition-all group">
                <div className="flex items-center gap-3">
                  <div className="bg-slate-100 group-hover:bg-blue-100 p-2 rounded-lg text-slate-600 group-hover:text-medical-blue transition-colors">
                    <Video size={18} />
                  </div>
                  <span className="font-medium text-slate-700 group-hover:text-medical-blue">
                    Book Telehealth
                  </span>
                </div>
              </button>
              <button className="w-full flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:border-medical-blue hover:bg-blue-50 transition-all group">
                <div className="flex items-center gap-3">
                  <div className="bg-slate-100 group-hover:bg-blue-100 p-2 rounded-lg text-slate-600 group-hover:text-medical-blue transition-colors">
                    <FileText size={18} />
                  </div>
                  <span className="font-medium text-slate-700 group-hover:text-medical-blue">
                    View Medical Records
                  </span>
                </div>
              </button>
            </div>
          </div>

          {/* Chat Panel */}
          <ChatPanel
            requestId={activeRequest.id}
            patientName={patient.name}
            doctorName="Dr. Emily Watson" />
          
        </div>
      </div>
    </div>);

};
// Helper component for timeline
const CheckCircle = ({ size }: {size: number;}) =>
<svg
  width={size}
  height={size}
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  strokeWidth="3"
  strokeLinecap="round"
  strokeLinejoin="round">
  
    <polyline points="20 6 9 17 4 12"></polyline>
  </svg>;