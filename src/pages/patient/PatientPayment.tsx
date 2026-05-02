import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShieldCheck, CreditCard, Lock, CheckCircle2 } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import { SecureBadge } from '../../components/SecureBadge';
export const PatientPayment: React.FC = () => {
  const { requestId } = useParams<{
    requestId: string;
  }>();
  const navigate = useNavigate();
  const { requests, submitPayment } = useAppContext();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const request = requests.find((r) => r.id === requestId);
  if (!request) return <div>Request not found</div>;
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      if (requestId) {
        submitPayment(requestId);
        setShowSuccess(true);
        setTimeout(() => {
          navigate('/patient/dashboard');
        }, 2500);
      }
    }, 1500);
  };
  if (showSuccess) {
    return (
      <motion.div
        initial={{
          opacity: 0,
          scale: 0.95
        }}
        animate={{
          opacity: 1,
          scale: 1
        }}
        className="max-w-md mx-auto mt-20 text-center bg-white p-10 rounded-2xl shadow-card border border-slate-200">
        
        <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 size={40} className="text-emerald-600" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-3">
          Request Submitted
        </h2>
        <p className="text-slate-600 mb-6">
          Your medical intake has been securely sent for review. A
          board-certified physician will evaluate your case within 24 hours.
        </p>
        <div className="animate-pulse flex justify-center gap-2 text-sm text-medical-blue font-medium">
          Redirecting to dashboard...
        </div>
      </motion.div>);

  }
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 20
      }}
      animate={{
        opacity: 1,
        y: 0
      }}
      className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-5 gap-8">
      
      {/* Left Column - Form */}
      <div className="md:col-span-3 space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">
            Submit for Medical Review
          </h1>
          <p className="text-slate-500">
            Enter your payment details to cover the consultation fee. You will
            not be charged for medication until approved.
          </p>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 flex gap-4">
          <ShieldCheck className="text-medical-blue flex-shrink-0" size={24} />
          <div>
            <h3 className="font-semibold text-blue-900 mb-1">
              100% Refund Guarantee
            </h3>
            <p className="text-sm text-blue-800">
              If our physicians determine that treatment is not appropriate for
              you, your consultation fee will be refunded in full automatically.
            </p>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl shadow-card border border-slate-200 p-6 sm:p-8">
          
          <h2 className="text-lg font-semibold text-slate-900 mb-6 flex items-center gap-2">
            <CreditCard size={20} className="text-slate-400" />
            Payment Method
          </h2>

          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Cardholder Name
              </label>
              <input
                type="text"
                required
                defaultValue="John Carter"
                className="w-full rounded-lg border-slate-300 border p-3 focus:ring-2 focus:ring-medical-blue outline-none" />
              
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Card Number
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  placeholder="0000 0000 0000 0000"
                  className="w-full rounded-lg border-slate-300 border p-3 pl-10 focus:ring-2 focus:ring-medical-blue outline-none font-mono" />
                
                <CreditCard
                  size={18}
                  className="absolute left-3 top-3.5 text-slate-400" />
                
              </div>
            </div>

            <div className="grid grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Expiry Date
                </label>
                <input
                  type="text"
                  required
                  placeholder="MM/YY"
                  className="w-full rounded-lg border-slate-300 border p-3 focus:ring-2 focus:ring-medical-blue outline-none font-mono" />
                
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  CVC
                </label>
                <input
                  type="text"
                  required
                  placeholder="123"
                  className="w-full rounded-lg border-slate-300 border p-3 focus:ring-2 focus:ring-medical-blue outline-none font-mono" />
                
              </div>
            </div>
          </div>

          <div className="mt-8">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-medical-blue hover:bg-blue-700 text-white py-3.5 rounded-xl font-semibold flex items-center justify-center gap-2 transition-colors shadow-sm disabled:opacity-70">
              
              {isSubmitting ?
              <span className="flex items-center gap-2">
                  <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24">
                  
                    <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4">
                  </circle>
                    <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                  </path>
                  </svg>
                  Processing Securely...
                </span> :

              <>
                  <Lock size={18} />
                  Submit for Medical Review — $
                  {request.consultationFee.toFixed(2)}
                </>
              }
            </button>
            <div className="mt-4 flex justify-center">
              <SecureBadge type="encryption" />
            </div>
          </div>
        </form>
      </div>

      {/* Right Column - Summary */}
      <div className="md:col-span-2">
        <div className="bg-white rounded-2xl shadow-card border border-slate-200 p-6 sticky top-24">
          <h3 className="font-semibold text-slate-900 mb-4 border-b border-slate-100 pb-4">
            Consultation Summary
          </h3>

          <div className="space-y-4 mb-6">
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Condition</span>
              <span className="font-medium text-slate-900">
                {request.condition}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Evaluation Type</span>
              <span className="font-medium text-slate-900">
                Asynchronous Review
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Provider</span>
              <span className="font-medium text-slate-900">
                Assigned after submission
              </span>
            </div>
          </div>

          <div className="border-t border-slate-100 pt-4 mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-slate-600">Consultation Fee</span>
              <span className="font-medium">
                ${request.consultationFee.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between items-center text-sm text-emerald-600 font-medium">
              <span>Medication Cost</span>
              <span>Billed if approved</span>
            </div>
          </div>

          <div className="bg-slate-50 rounded-lg p-4 text-sm text-slate-600">
            <p className="font-medium text-slate-900 mb-1">
              What happens next?
            </p>
            <ol className="list-decimal list-inside space-y-1.5 mt-2">
              <li>Doctor reviews your intake</li>
              <li>Decision made within 24h</li>
              <li>If approved, treatment begins</li>
              <li>If denied, full refund issued</li>
            </ol>
          </div>
        </div>
      </div>
    </motion.div>);

};