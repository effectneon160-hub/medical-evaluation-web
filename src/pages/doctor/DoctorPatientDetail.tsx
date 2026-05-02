import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  User,
  FileText,
  Activity,
  CheckCircle,
  XCircle,
  Video,
  MessageSquare } from
'lucide-react';
import { useAppContext } from '../../context/AppContext';
import { StatusBadge } from '../../components/StatusBadge';
import { ChatPanel } from '../../components/ChatPanel';
export const DoctorPatientDetail: React.FC = () => {
  const { requestId } = useParams<{
    requestId: string;
  }>();
  const navigate = useNavigate();
  const { requests, patients, approveRequest, denyRequest } = useAppContext();
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showDenyModal, setShowDenyModal] = useState(false);
  // Approval Form State
  const [medication, setMedication] = useState('');
  const [dosage, setDosage] = useState('');
  const [frequency, setFrequency] = useState('');
  const [notes, setNotes] = useState('');
  // Denial Form State
  const [denialReason, setDenialReason] = useState('');
  const request = requests.find((r) => r.id === requestId);
  const patient = patients.find((p) => p.id === request?.patientId);
  if (!request || !patient) return <div>Request not found</div>;
  const handleApprove = () => {
    approveRequest(request.id, {
      medications: [
      {
        id: `MED-${Date.now()}`,
        name: medication,
        dosage,
        frequency,
        refillDate: new Date(
          Date.now() + 30 * 24 * 60 * 60 * 1000
        ).toISOString(),
        paused: false
      }],

      notes
    });
    setShowApproveModal(false);
  };
  const handleDeny = () => {
    denyRequest(request.id, denialReason);
    setShowDenyModal(false);
  };
  return (
    <div className="max-w-7xl mx-auto">
      <button
        onClick={() => navigate('/doctor/dashboard')}
        className="flex items-center gap-2 text-slate-500 hover:text-slate-800 mb-6 transition-colors">
        
        <ArrowLeft size={18} /> Back to Dashboard
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Patient Data */}
        <div className="lg:col-span-2 space-y-6">
          {/* Patient Header Card */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center">
                  <User size={32} className="text-slate-400" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-slate-900">
                    {patient.name}
                  </h1>
                  <div className="flex gap-3 text-sm text-slate-500 mt-1">
                    <span>{patient.age} yrs</span>
                    <span>•</span>
                    <span>{patient.sex}</span>
                    <span>•</span>
                    <span>
                      DOB: {new Date(patient.dob).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
              <StatusBadge status={request.status} size="lg" />
            </div>

            <div className="grid grid-cols-2 gap-4 pt-6 border-t border-slate-100">
              <div>
                <p className="text-sm text-slate-500 mb-1">Primary Condition</p>
                <p className="font-medium text-slate-900">
                  {request.condition}
                </p>
              </div>
              <div>
                <p className="text-sm text-slate-500 mb-1">Duration</p>
                <p className="font-medium text-slate-900">{request.duration}</p>
              </div>
              <div className="col-span-2">
                <p className="text-sm text-slate-500 mb-1">
                  Previous Treatment
                </p>
                <p className="font-medium text-slate-900">
                  {request.previousTreatment}
                </p>
              </div>
            </div>
          </div>

          {/* Clinical Details */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50 flex items-center gap-2">
              <Activity size={18} className="text-medical-blue" />
              <h2 className="font-semibold text-slate-900">
                Clinical Evaluation
              </h2>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <h3 className="text-sm font-semibold text-slate-900 mb-2 uppercase tracking-wider">
                  Patient Reported Symptoms
                </h3>
                <p className="text-slate-700 bg-slate-50 p-4 rounded-lg border border-slate-100">
                  {request.symptoms}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-semibold text-slate-900 mb-3 uppercase tracking-wider">
                    Medical History
                  </h3>
                  <ul className="space-y-2">
                    <li className="flex justify-between text-sm">
                      <span className="text-slate-500">Conditions</span>
                      <span className="font-medium text-slate-900 text-right">
                        {(request.questionnaire.conditions || []).join(', ') ||
                        'None reported'}
                      </span>
                    </li>
                    <li className="flex justify-between text-sm">
                      <span className="text-slate-500">Current Meds</span>
                      <span className="font-medium text-slate-900 text-right">
                        {request.questionnaire.medications || 'None'}
                      </span>
                    </li>
                    <li className="flex justify-between text-sm">
                      <span className="text-slate-500">Allergies</span>
                      <span className="font-medium text-red-600 text-right">
                        {request.questionnaire.allergies || 'None'}
                      </span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-slate-900 mb-3 uppercase tracking-wider">
                    Lifestyle
                  </h3>
                  <ul className="space-y-2">
                    <li className="flex justify-between text-sm">
                      <span className="text-slate-500">Exercise</span>
                      <span className="font-medium text-slate-900 text-right">
                        {request.questionnaire.exercise || 'Not provided'}
                      </span>
                    </li>
                    <li className="flex justify-between text-sm">
                      <span className="text-slate-500">Severity (1-10)</span>
                      <span className="font-medium text-slate-900 text-right">
                        {request.questionnaire.severity || 'N/A'}
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Actions & Chat */}
        <div className="space-y-6">
          {/* Action Panel */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 sticky top-24">
            <h3 className="font-semibold text-slate-900 mb-4">
              Medical Decision
            </h3>

            {request.status === 'pending' ||
            request.status === 'under_review' ?
            <div className="space-y-3">
                <button
                onClick={() => setShowApproveModal(true)}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-colors shadow-sm">
                
                  <CheckCircle size={20} /> Approve Treatment
                </button>
                <button
                onClick={() => setShowDenyModal(true)}
                className="w-full bg-white border-2 border-red-100 text-red-600 hover:bg-red-50 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-colors">
                
                  <XCircle size={20} /> Deny Request
                </button>

                <div className="my-4 border-t border-slate-100"></div>

                <button className="w-full bg-slate-50 hover:bg-slate-100 text-slate-700 py-2.5 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors border border-slate-200">
                  <Video size={18} /> Request Telehealth
                </button>
              </div> :

            <div
              className={`p-4 rounded-xl border ${request.status === 'approved' ? 'bg-emerald-50 border-emerald-200' : 'bg-red-50 border-red-200'}`}>
              
                <p
                className={`font-semibold ${request.status === 'approved' ? 'text-emerald-800' : 'text-red-800'}`}>
                
                  Request{' '}
                  {request.status === 'approved' ? 'Approved' : 'Denied'}
                </p>
                <p className="text-sm mt-1 opacity-80">
                  Action taken on{' '}
                  {new Date(request.updatedAt).toLocaleDateString()}
                </p>
              </div>
            }
          </div>

          {/* Chat Panel */}
          <ChatPanel
            requestId={request.id}
            patientName={patient.name}
            doctorName="Dr. Emily Watson" />
          
        </div>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {showApproveModal &&
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
            initial={{
              opacity: 0,
              scale: 0.95
            }}
            animate={{
              opacity: 1,
              scale: 1
            }}
            exit={{
              opacity: 0,
              scale: 0.95
            }}
            className="bg-white rounded-2xl shadow-xl max-w-lg w-full overflow-hidden">
            
              <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-emerald-50">
                <h3 className="text-lg font-bold text-emerald-900 flex items-center gap-2">
                  <CheckCircle size={20} className="text-emerald-600" />
                  Create Treatment Plan
                </h3>
                <button
                onClick={() => setShowApproveModal(false)}
                className="text-emerald-700 hover:text-emerald-900">
                
                  <XCircle size={24} />
                </button>
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Medication
                  </label>
                  <input
                  type="text"
                  value={medication}
                  onChange={(e) => setMedication(e.target.value)}
                  placeholder="e.g., Sildenafil"
                  className="w-full rounded-lg border-slate-300 border p-2.5 focus:ring-2 focus:ring-emerald-500 outline-none" />
                
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Dosage
                    </label>
                    <input
                    type="text"
                    value={dosage}
                    onChange={(e) => setDosage(e.target.value)}
                    placeholder="e.g., 50mg"
                    className="w-full rounded-lg border-slate-300 border p-2.5 focus:ring-2 focus:ring-emerald-500 outline-none" />
                  
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Frequency
                    </label>
                    <input
                    type="text"
                    value={frequency}
                    onChange={(e) => setFrequency(e.target.value)}
                    placeholder="e.g., As needed"
                    className="w-full rounded-lg border-slate-300 border p-2.5 focus:ring-2 focus:ring-emerald-500 outline-none" />
                  
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Clinical Notes & Instructions
                  </label>
                  <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  placeholder="Instructions for the patient..."
                  className="w-full rounded-lg border-slate-300 border p-2.5 focus:ring-2 focus:ring-emerald-500 outline-none">
                </textarea>
                </div>
              </div>

              <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
                <button
                onClick={() => setShowApproveModal(false)}
                className="px-4 py-2 text-slate-600 font-medium hover:bg-slate-200 rounded-lg transition-colors">
                
                  Cancel
                </button>
                <button
                onClick={handleApprove}
                disabled={!medication || !dosage}
                className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50">
                
                  Approve & Prescribe
                </button>
              </div>
            </motion.div>
          </div>
        }

        {showDenyModal &&
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
            initial={{
              opacity: 0,
              scale: 0.95
            }}
            animate={{
              opacity: 1,
              scale: 1
            }}
            exit={{
              opacity: 0,
              scale: 0.95
            }}
            className="bg-white rounded-2xl shadow-xl max-w-lg w-full overflow-hidden">
            
              <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-red-50">
                <h3 className="text-lg font-bold text-red-900 flex items-center gap-2">
                  <XCircle size={20} className="text-red-600" />
                  Deny Request
                </h3>
                <button
                onClick={() => setShowDenyModal(false)}
                className="text-red-700 hover:text-red-900">
                
                  <XCircle size={24} />
                </button>
              </div>

              <div className="p-6 space-y-4">
                <div className="bg-amber-50 border border-amber-200 p-3 rounded-lg text-sm text-amber-800 mb-4">
                  Denying this request will automatically trigger a full refund
                  to the patient.
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Reason for Denial (Visible to Patient)
                  </label>
                  <textarea
                  value={denialReason}
                  onChange={(e) => setDenialReason(e.target.value)}
                  rows={4}
                  placeholder="E.g., Based on your medical history, an in-person evaluation is required..."
                  className="w-full rounded-lg border-slate-300 border p-2.5 focus:ring-2 focus:ring-red-500 outline-none">
                </textarea>
                </div>
              </div>

              <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
                <button
                onClick={() => setShowDenyModal(false)}
                className="px-4 py-2 text-slate-600 font-medium hover:bg-slate-200 rounded-lg transition-colors">
                
                  Cancel
                </button>
                <button
                onClick={handleDeny}
                disabled={!denialReason}
                className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50">
                
                  Confirm Denial
                </button>
              </div>
            </motion.div>
          </div>
        }
      </AnimatePresence>
    </div>);

};