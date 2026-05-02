import React from 'react';
import { ShieldCheck, Lock } from 'lucide-react';
interface SecureBadgeProps {
  type?: 'hipaa' | 'encryption' | 'doctor';
  className?: string;
}
export const SecureBadge: React.FC<SecureBadgeProps> = ({
  type = 'hipaa',
  className = ''
}) => {
  if (type === 'encryption') {
    return (
      <div
        className={`flex items-center gap-2 text-xs text-slate-500 ${className}`}>
        
        <Lock size={14} className="text-slate-400" />
        <span>End-to-end encrypted</span>
      </div>);

  }
  if (type === 'doctor') {
    return (
      <div
        className={`flex items-center gap-2 text-xs text-slate-500 ${className}`}>
        
        <ShieldCheck size={14} className="text-medical-blue" />
        <span>Board-certified physicians</span>
      </div>);

  }
  return (
    <div
      className={`flex items-center gap-2 text-xs text-slate-500 ${className}`}>
      
      <ShieldCheck size={14} className="text-emerald-600" />
      <span>HIPAA Compliant Platform</span>
    </div>);

};