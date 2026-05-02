import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShieldCheck, UploadCloud, ArrowRight, Info } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import { SecureBadge } from '../../components/SecureBadge';
const CONDITIONS = [
'Erectile Dysfunction',
'Hair Loss',
'Testosterone Replacement',
'Sleep Apnea',
'Weight Management',
'Skin Conditions',
'Anxiety / Depression'];

export const PatientIntake: React.FC = () => {
  const navigate = useNavigate();
  const { submitIntake } = useAppContext();
  const [formData, setFormData] = useState({
    condition: '',
    sex: '',
    dob: '',
    duration: '',
    hasPreviousTreatment: false,
    previousTreatment: '',
    symptoms: ''
  });
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const requestId = submitIntake({
      condition: formData.condition,
      duration: formData.duration,
      previousTreatment: formData.hasPreviousTreatment ?
      formData.previousTreatment :
      'None',
      symptoms: formData.symptoms
    });
    navigate(`/patient/questionnaire/${requestId}`);
  };
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
      className="max-w-2xl mx-auto">
      
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-3">
          Start Your Medical Consultation
        </h1>
        <p className="text-slate-500 max-w-lg mx-auto">
          Complete this secure intake form. A board-certified physician will
          review your information to determine if treatment is appropriate.
        </p>
        <div className="flex justify-center gap-6 mt-6">
          <SecureBadge type="hipaa" />
          <SecureBadge type="doctor" />
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-card border border-slate-200 overflow-hidden">
        <div className="bg-blue-50 border-b border-blue-100 p-4 flex items-start gap-3">
          <Info className="text-blue-600 mt-0.5 flex-shrink-0" size={20} />
          <p className="text-sm text-blue-800">
            <strong>Medical Evaluation Required:</strong> You cannot purchase
            medication directly. All requests are subject to physician approval
            based on this intake.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-8">
          {/* Basic Info */}
          <section className="space-y-5">
            <h2 className="text-lg font-semibold text-slate-900 border-b border-slate-100 pb-2">
              Primary Concern
            </h2>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                What condition are you seeking treatment for? *
              </label>
              <select
                required
                className="w-full rounded-lg border-slate-300 border p-3 text-slate-700 focus:ring-2 focus:ring-medical-blue focus:border-medical-blue outline-none transition-all"
                value={formData.condition}
                onChange={(e) =>
                setFormData({
                  ...formData,
                  condition: e.target.value
                })
                }>
                
                <option value="" disabled>
                  Select a condition...
                </option>
                {CONDITIONS.map((c) =>
                <option key={c} value={c}>
                    {c}
                  </option>
                )}
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Biological Sex *
                </label>
                <div className="flex gap-4">
                  {['Male', 'Female'].map((sex) =>
                  <label
                    key={sex}
                    className="flex items-center gap-2 cursor-pointer">
                    
                      <input
                      type="radio"
                      name="sex"
                      value={sex}
                      required
                      className="text-medical-blue focus:ring-medical-blue w-4 h-4"
                      onChange={(e) =>
                      setFormData({
                        ...formData,
                        sex: e.target.value
                      })
                      } />
                    
                      <span className="text-slate-700">{sex}</span>
                    </label>
                  )}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Date of Birth *
                </label>
                <input
                  type="date"
                  required
                  className="w-full rounded-lg border-slate-300 border p-2.5 text-slate-700 focus:ring-2 focus:ring-medical-blue focus:border-medical-blue outline-none"
                  onChange={(e) =>
                  setFormData({
                    ...formData,
                    dob: e.target.value
                  })
                  } />
                
              </div>
            </div>
          </section>

          {/* Medical Details */}
          <section className="space-y-5">
            <h2 className="text-lg font-semibold text-slate-900 border-b border-slate-100 pb-2">
              Condition Details
            </h2>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                How long have you experienced this? *
              </label>
              <select
                required
                className="w-full rounded-lg border-slate-300 border p-3 text-slate-700 focus:ring-2 focus:ring-medical-blue focus:border-medical-blue outline-none"
                onChange={(e) =>
                setFormData({
                  ...formData,
                  duration: e.target.value
                })
                }>
                
                <option value="" disabled>
                  Select duration...
                </option>
                <option value="Less than 1 month">Less than 1 month</option>
                <option value="1-6 months">1-6 months</option>
                <option value="6-12 months">6-12 months</option>
                <option value="1-3 years">1-3 years</option>
                <option value="More than 3 years">More than 3 years</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Have you been treated for this before? *
              </label>
              <div className="flex gap-4 mb-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="prevTreatment"
                    value="yes"
                    className="text-medical-blue w-4 h-4"
                    onChange={() =>
                    setFormData({
                      ...formData,
                      hasPreviousTreatment: true
                    })
                    } />
                  
                  <span>Yes</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="prevTreatment"
                    value="no"
                    className="text-medical-blue w-4 h-4"
                    onChange={() =>
                    setFormData({
                      ...formData,
                      hasPreviousTreatment: false
                    })
                    } />
                  
                  <span>No</span>
                </label>
              </div>

              {formData.hasPreviousTreatment &&
              <motion.div
                initial={{
                  opacity: 0,
                  height: 0
                }}
                animate={{
                  opacity: 1,
                  height: 'auto'
                }}>
                
                  <input
                  type="text"
                  placeholder="E.g., Sildenafil 50mg, Therapy..."
                  className="w-full rounded-lg border-slate-300 border p-3 text-slate-700 focus:ring-2 focus:ring-medical-blue outline-none"
                  onChange={(e) =>
                  setFormData({
                    ...formData,
                    previousTreatment: e.target.value
                  })
                  }
                  required={formData.hasPreviousTreatment} />
                
                </motion.div>
              }
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Describe your current symptoms *
              </label>
              <textarea
                required
                rows={4}
                className="w-full rounded-lg border-slate-300 border p-3 text-slate-700 focus:ring-2 focus:ring-medical-blue outline-none resize-none"
                placeholder="Please be as detailed as possible to help the doctor evaluate your case..."
                onChange={(e) =>
                setFormData({
                  ...formData,
                  symptoms: e.target.value
                })
                }>
              </textarea>
            </div>
          </section>

          {/* Document Upload (UI Only) */}
          <section className="space-y-4">
            <h2 className="text-lg font-semibold text-slate-900 border-b border-slate-100 pb-2">
              Supporting Documents (Optional)
            </h2>
            <p className="text-sm text-slate-500">
              Upload recent lab results, previous prescriptions, or photo ID if
              required for your condition.
            </p>

            <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center hover:bg-slate-50 transition-colors cursor-pointer">
              <UploadCloud className="mx-auto h-10 w-10 text-slate-400 mb-3" />
              <p className="text-sm font-medium text-medical-blue">
                Click to upload or drag and drop
              </p>
              <p className="text-xs text-slate-500 mt-1">
                PDF, JPG, PNG up to 10MB
              </p>
            </div>
          </section>

          <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
            <SecureBadge type="encryption" />
            <button
              type="submit"
              className="bg-medical-blue hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium flex items-center gap-2 transition-colors shadow-sm">
              
              Continue to Medical Review
              <ArrowRight size={18} />
            </button>
          </div>
        </form>
      </div>
    </motion.div>);

};