import React from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Activity, User, Shield, Stethoscope, LogOut } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { Role } from '../types';
import { NotificationBell } from './NotificationBell';
export const Layout: React.FC = () => {
  const { currentRole, setCurrentRole } = useAppContext();
  const navigate = useNavigate();
  const location = useLocation();
  const handleRoleSwitch = (role: Role) => {
    setCurrentRole(role);
    if (role === 'patient') navigate('/patient/dashboard');
    if (role === 'doctor') navigate('/doctor/dashboard');
    if (role === 'admin') navigate('/admin/dashboard');
  };
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {/* Top Navigation Bar */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => navigate('/')}>
              
              <div className="bg-medical-blue p-1.5 rounded-lg">
                <Activity size={20} className="text-white" />
              </div>
              <span className="font-bold text-xl tracking-tight text-slate-900">
                MedEval
              </span>
            </div>

            {/* Role Switcher (Demo purposes) */}
            <div className="hidden md:flex bg-slate-100 p-1 rounded-lg border border-slate-200">
              <button
                onClick={() => handleRoleSwitch('patient')}
                className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${currentRole === 'patient' ? 'bg-white text-medical-blue shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
                
                Patient View
              </button>
              <button
                onClick={() => handleRoleSwitch('doctor')}
                className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${currentRole === 'doctor' ? 'bg-white text-medical-blue shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
                
                Doctor View
              </button>
              <button
                onClick={() => handleRoleSwitch('admin')}
                className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${currentRole === 'admin' ? 'bg-white text-medical-blue shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
                
                Admin View
              </button>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-4">
              <NotificationBell />

              <div className="h-8 w-px bg-slate-200 mx-1"></div>

              <div className="flex items-center gap-3">
                <div className="hidden sm:block text-right">
                  <div className="text-sm font-semibold text-slate-900">
                    {currentRole === 'patient' ?
                    'John Carter' :
                    currentRole === 'doctor' ?
                    'Dr. E. Watson' :
                    'System Admin'}
                  </div>
                  <div className="text-xs text-slate-500 capitalize">
                    {currentRole}
                  </div>
                </div>
                <div className="h-9 w-9 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-500">
                  {currentRole === 'patient' ?
                  <User size={18} /> :
                  currentRole === 'doctor' ?
                  <Stethoscope size={18} /> :

                  <Shield size={18} />
                  }
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
    </div>);

};