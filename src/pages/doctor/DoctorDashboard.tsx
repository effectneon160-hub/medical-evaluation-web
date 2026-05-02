import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Users,
  Clock,
  CheckCircle,
  XCircle,
  ChevronRight,
  AlertCircle } from
'lucide-react';
import { useAppContext } from '../../context/AppContext';
import { StatusBadge } from '../../components/StatusBadge';
export const DoctorDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { requests, patients } = useAppContext();
  // Stats
  const pendingCount = requests.filter(
    (r) => r.status === 'pending' || r.status === 'under_review'
  ).length;
  const approvedCount = requests.filter((r) => r.status === 'approved').length;
  const deniedCount = requests.filter((r) => r.status === 'denied').length;
  const totalCount = requests.length;
  // Pending Queue
  const pendingRequests = requests.
  filter((r) => r.status === 'pending' || r.status === 'under_review').
  sort(
    (a, b) =>
    new Date(a.submittedAt).getTime() - new Date(b.submittedAt).getTime()
  );
  const getPatientName = (id: string) =>
  patients.find((p) => p.id === id)?.name || 'Unknown Patient';
  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          Provider Dashboard
        </h1>
        <p className="text-slate-500">
          Welcome back, Dr. Watson. You have {pendingCount} patients awaiting
          review.
        </p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
        {
          label: 'Pending Review',
          value: pendingCount,
          icon: Clock,
          color: 'text-amber-600',
          bg: 'bg-amber-50'
        },
        {
          label: 'Approved',
          value: approvedCount,
          icon: CheckCircle,
          color: 'text-emerald-600',
          bg: 'bg-emerald-50'
        },
        {
          label: 'Denied',
          value: deniedCount,
          icon: XCircle,
          color: 'text-red-600',
          bg: 'bg-red-50'
        },
        {
          label: 'Total Patients',
          value: totalCount,
          icon: Users,
          color: 'text-blue-600',
          bg: 'bg-blue-50'
        }].
        map((stat, idx) =>
        <motion.div
          key={idx}
          initial={{
            opacity: 0,
            y: 20
          }}
          animate={{
            opacity: 1,
            y: 0
          }}
          transition={{
            delay: idx * 0.1
          }}
          className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 flex items-center gap-4">
          
            <div className={`p-3 rounded-lg ${stat.bg} ${stat.color}`}>
              <stat.icon size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">{stat.label}</p>
              <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
            </div>
          </motion.div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Queue */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
              <h2 className="font-semibold text-slate-900 flex items-center gap-2">
                <Clock size={18} className="text-amber-500" />
                Pending Review Queue
              </h2>
              <span className="text-xs font-medium bg-slate-200 text-slate-700 px-2.5 py-1 rounded-full">
                {pendingRequests.length} Patients
              </span>
            </div>

            <div className="divide-y divide-slate-100">
              {pendingRequests.length === 0 ?
              <div className="p-8 text-center text-slate-500">
                  No pending requests at this time.
                </div> :

              pendingRequests.map((req) => {
                const isUrgent =
                new Date(req.submittedAt).getTime() <
                Date.now() - 24 * 60 * 60 * 1000; // > 24h old
                return (
                  <div
                    key={req.id}
                    className="p-4 hover:bg-slate-50 transition-colors flex items-center justify-between group">
                    
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm flex-shrink-0">
                          {getPatientName(req.patientId).
                        split(' ').
                        map((n) => n[0]).
                        join('')}
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-slate-900">
                              {getPatientName(req.patientId)}
                            </h3>
                            {isUrgent &&
                          <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-red-600 bg-red-50 px-1.5 py-0.5 rounded">
                                <AlertCircle size={10} /> Urgent
                              </span>
                          }
                          </div>
                          <div className="flex items-center gap-3 text-sm text-slate-500">
                            <span>{req.condition}</span>
                            <span>•</span>
                            <span>
                              Submitted{' '}
                              {new Date(req.submittedAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <StatusBadge status={req.status} size="sm" />
                        <button
                        onClick={() => navigate(`/doctor/patient/${req.id}`)}
                        className="px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg text-sm font-medium hover:border-medical-blue hover:text-medical-blue transition-colors flex items-center gap-1 opacity-0 group-hover:opacity-100">
                        
                          Review <ChevronRight size={16} />
                        </button>
                      </div>
                    </div>);

              })
              }
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
            <h3 className="font-semibold text-slate-900 mb-4">
              Recent Activity
            </h3>
            <div className="space-y-4">
              {requests.
              filter((r) => r.status === 'approved' || r.status === 'denied').
              slice(0, 5).
              map((req) =>
              <div key={req.id} className="flex gap-3">
                    <div className="mt-0.5">
                      {req.status === 'approved' ?
                  <CheckCircle size={16} className="text-emerald-500" /> :

                  <XCircle size={16} className="text-red-500" />
                  }
                    </div>
                    <div>
                      <p className="text-sm text-slate-800">
                        You <span className="font-medium">{req.status}</span>{' '}
                        request for{' '}
                        <span className="font-medium">
                          {getPatientName(req.patientId)}
                        </span>
                      </p>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {new Date(req.updatedAt).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                      </p>
                    </div>
                  </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>);

};