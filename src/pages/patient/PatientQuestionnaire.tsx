import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ArrowLeft, CheckCircle } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
const STEPS = [
{
  id: 'lifestyle',
  title: 'Lifestyle & Habits'
},
{
  id: 'history',
  title: 'Medical History'
},
{
  id: 'severity',
  title: 'Condition Severity'
},
{
  id: 'goals',
  title: 'Treatment Goals'
}];

export const PatientQuestionnaire: React.FC = () => {
  const { requestId } = useParams<{
    requestId: string;
  }>();
  const navigate = useNavigate();
  const { updateQuestionnaire } = useAppContext();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      // Finish
      if (requestId) {
        updateQuestionnaire(requestId, answers);
        navigate(`/patient/payment/${requestId}`);
      }
    }
  };
  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    } else {
      navigate(-1);
    }
  };
  const updateAnswer = (key: string, value: any) => {
    setAnswers((prev) => ({
      ...prev,
      [key]: value
    }));
  };
  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        // Lifestyle
        return (
          <div className="space-y-6">
            <div>
              <label className="block font-medium text-slate-800 mb-3">
                How often do you exercise?
              </label>
              <div className="space-y-2">
                {[
                'Rarely',
                '1-2 times a week',
                '3-4 times a week',
                'Daily'].
                map((opt) =>
                <label
                  key={opt}
                  className={`flex items-center p-4 border rounded-xl cursor-pointer transition-all ${answers.exercise === opt ? 'border-medical-blue bg-blue-50' : 'border-slate-200 hover:border-slate-300'}`}>
                  
                    <input
                    type="radio"
                    name="exercise"
                    className="hidden"
                    checked={answers.exercise === opt}
                    onChange={() => updateAnswer('exercise', opt)} />
                  
                    <div
                    className={`w-5 h-5 rounded-full border flex items-center justify-center mr-3 ${answers.exercise === opt ? 'border-medical-blue' : 'border-slate-300'}`}>
                    
                      {answers.exercise === opt &&
                    <div className="w-2.5 h-2.5 bg-medical-blue rounded-full" />
                    }
                    </div>
                    <span
                    className={
                    answers.exercise === opt ?
                    'font-medium text-medical-blue' :
                    'text-slate-700'
                    }>
                    
                      {opt}
                    </span>
                  </label>
                )}
              </div>
            </div>
            <div>
              <label className="block font-medium text-slate-800 mb-3">
                Do you smoke or consume alcohol?
              </label>
              <textarea
                className="w-full border border-slate-300 rounded-xl p-3 focus:ring-2 focus:ring-medical-blue outline-none"
                rows={3}
                placeholder="E.g., Smoke 1 pack a day, drink occasionally..."
                value={answers.habits || ''}
                onChange={(e) => updateAnswer('habits', e.target.value)} />
              
            </div>
          </div>);

      case 1:
        // History
        return (
          <div className="space-y-6">
            <div>
              <label className="block font-medium text-slate-800 mb-3">
                Do you have any of the following conditions? (Select all that
                apply)
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                'High Blood Pressure',
                'Heart Disease',
                'Diabetes',
                'Kidney Disease',
                'Liver Disease',
                'None of the above'].
                map((cond) => {
                  const isSelected = (answers.conditions || []).includes(cond);
                  return (
                    <label
                      key={cond}
                      className={`flex items-center p-3 border rounded-xl cursor-pointer transition-all ${isSelected ? 'border-medical-blue bg-blue-50' : 'border-slate-200 hover:border-slate-300'}`}>
                      
                      <input
                        type="checkbox"
                        className="hidden"
                        checked={isSelected}
                        onChange={() => {
                          const current = answers.conditions || [];
                          if (cond === 'None of the above') {
                            updateAnswer('conditions', ['None of the above']);
                          } else {
                            const newConds = isSelected ?
                            current.filter((c: string) => c !== cond) :
                            [
                            ...current.filter(
                              (c: string) => c !== 'None of the above'
                            ),
                            cond];

                            updateAnswer('conditions', newConds);
                          }
                        }} />
                      
                      <div
                        className={`w-5 h-5 rounded border flex items-center justify-center mr-3 ${isSelected ? 'border-medical-blue bg-medical-blue' : 'border-slate-300'}`}>
                        
                        {isSelected &&
                        <CheckCircle size={14} className="text-white" />
                        }
                      </div>
                      <span
                        className={
                        isSelected ?
                        'font-medium text-medical-blue' :
                        'text-slate-700'
                        }>
                        
                        {cond}
                      </span>
                    </label>);

                })}
              </div>
            </div>
            <div>
              <label className="block font-medium text-slate-800 mb-3">
                List any current medications or supplements:
              </label>
              <textarea
                className="w-full border border-slate-300 rounded-xl p-3 focus:ring-2 focus:ring-medical-blue outline-none"
                rows={3}
                placeholder="Include dosage if known..."
                value={answers.medications || ''}
                onChange={(e) => updateAnswer('medications', e.target.value)} />
              
            </div>
          </div>);

      case 2:
        // Severity
        return (
          <div className="space-y-8">
            <div>
              <label className="block font-medium text-slate-800 mb-6">
                On a scale of 1-10, how severely does this condition impact your
                daily life?
              </label>
              <div className="px-4">
                <input
                  type="range"
                  min="1"
                  max="10"
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-medical-blue"
                  value={answers.severity || 5}
                  onChange={(e) =>
                  updateAnswer('severity', parseInt(e.target.value))
                  } />
                
                <div className="flex justify-between text-sm text-slate-500 mt-3 font-medium">
                  <span>1 (Mild)</span>
                  <span className="text-medical-blue font-bold text-lg">
                    {answers.severity || 5}
                  </span>
                  <span>10 (Severe)</span>
                </div>
              </div>
            </div>
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
              <h4 className="font-medium text-amber-800 mb-1">Doctor's Note</h4>
              <p className="text-sm text-amber-700">
                Please be honest about your severity. This helps our physicians
                determine the correct dosage and treatment path.
              </p>
            </div>
          </div>);

      case 3:
        // Goals
        return (
          <div className="space-y-6">
            <div>
              <label className="block font-medium text-slate-800 mb-3">
                What are your primary goals for treatment?
              </label>
              <textarea
                className="w-full border border-slate-300 rounded-xl p-3 focus:ring-2 focus:ring-medical-blue outline-none"
                rows={4}
                placeholder="E.g., I want to restore normal function, reduce pain, improve sleep..."
                value={answers.goals || ''}
                onChange={(e) => updateAnswer('goals', e.target.value)} />
              
            </div>
            <div>
              <label className="block font-medium text-slate-800 mb-3">
                Do you have any known drug allergies?
              </label>
              <input
                type="text"
                className="w-full border border-slate-300 rounded-xl p-3 focus:ring-2 focus:ring-medical-blue outline-none"
                placeholder="If none, type 'None'"
                value={answers.allergies || ''}
                onChange={(e) => updateAnswer('allergies', e.target.value)} />
              
            </div>
          </div>);

      default:
        return null;
    }
  };
  return (
    <div className="max-w-2xl mx-auto">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between text-sm font-medium text-slate-500 mb-2">
          <span>
            Step {currentStep + 1} of {STEPS.length}
          </span>
          <span className="text-medical-blue">{STEPS[currentStep].title}</span>
        </div>
        <div className="w-full bg-slate-200 rounded-full h-2.5">
          <div
            className="bg-medical-blue h-2.5 rounded-full transition-all duration-500 ease-out"
            style={{
              width: `${(currentStep + 1) / STEPS.length * 100}%`
            }}>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-card border border-slate-200 overflow-hidden">
        <div className="p-6 sm:p-8 min-h-[400px] flex flex-col">
          <div className="flex-1">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{
                  opacity: 0,
                  x: 20
                }}
                animate={{
                  opacity: 1,
                  x: 0
                }}
                exit={{
                  opacity: 0,
                  x: -20
                }}
                transition={{
                  duration: 0.2
                }}>
                
                <h2 className="text-2xl font-bold text-slate-900 mb-6">
                  {STEPS[currentStep].title}
                </h2>
                {renderStepContent()}
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="pt-8 mt-8 border-t border-slate-100 flex items-center justify-between">
            <button
              onClick={handleBack}
              className="px-5 py-2.5 text-slate-600 font-medium hover:bg-slate-100 rounded-lg transition-colors flex items-center gap-2">
              
              <ArrowLeft size={18} />
              Back
            </button>
            <button
              onClick={handleNext}
              className="bg-medical-blue hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-medium flex items-center gap-2 transition-colors shadow-sm">
              
              {currentStep === STEPS.length - 1 ?
              'Review & Submit' :
              'Next Step'}
              {currentStep !== STEPS.length - 1 && <ArrowRight size={18} />}
            </button>
          </div>
        </div>
      </div>
    </div>);

};