import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  Stethoscope,
  FileText,
  DollarSign,
  ShieldAlert,
  Activity } from
'lucide-react';
import { useAppContext } from '../../context/AppContext';
import { StatusBadge } from '../../components/StatusBadge';
type TabType = 'overview' | 'patients' | 'doctors' | 'audit';
export const AdminDashboard: React.FC = () => {
  const { patients, requests, doctors, auditLogs } = useAppContext();
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  // Stats
  const totalRevenue = requests.
  filter((r) => r.status === 'approved').
  reduce((acc, r) => acc + r.consultationFee, 0);
  const totalRefunds = requests.
  filter((r) => r.status === 'denied').
  reduce((acc, r) => acc + r.consultationFee, 0);
  const renderOverview = () =>
  <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
      {
        label: 'Total Patients',
        value: patients.length,
        icon: Users,
        color: 'text-blue-600',
        bg: 'bg-blue-50'
      },
      {
        label: 'Active Doctors',
        value: doctors.filter((d) => d.status === 'active').length,
        icon: Stethoscope,
        color: 'text-emerald-600',
        bg: 'bg-emerald-50'
      },
      {
        label: 'Total Revenue',
        value: `$${totalRevenue.toFixed(2)}`,
        icon: DollarSign,
        color: 'text-indigo-600',
        bg: 'bg-indigo-50'
      },
      {
        label: 'Pending Refunds',
        value: `$${totalRefunds.toFixed(2)}`,
        icon: ShieldAlert,
        color: 'text-amber-600',
        bg: 'bg-amber-50'
      }].
      map((stat, idx) =>
      <div
        key={idx}
        className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 flex items-center gap-4">
        
            <div className={`p-3 rounded-lg ${stat.bg} ${stat.color}`}>
              <stat.icon size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">{stat.label}</p>
              <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
            </div>
          </div>
      )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <Activity size={18} className="text-slate-500" /> Recent System
            Activity
          </h3>
          <div className="space-y-4">
            {auditLogs.slice(0, 5).map((log) =>
          <div key={log.id} className="flex gap-3 text-sm">
                <div className="w-2 h-2 rounded-full bg-medical-blue mt-1.5 flex-shrink-0"></div>
                <div>
                  <p className="text-slate-800">
                    <span className="font-medium">{log.user}</span> ({log.role}){' '}
                    {log.action}
                  </p>
                  <p className="text-slate-500 text-xs mt-0.5">
                    {new Date(log.timestamp).toLocaleString()}
                  </p>
                </div>
              </div>
          )}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h3 className="font-semibold text-slate-900 mb-4">
            Request Status Distribution
          </h3>
          <div className="space-y-4">
            {['pending', 'approved', 'denied'].map((status) => {
            const count = requests.filter((r) => r.status === status).length;
            const percent = Math.round(count / requests.length * 100) || 0;
            const colors = {
              pending: 'bg-amber-500',
              approved: 'bg-emerald-500',
              denied: 'bg-red-500'
            };
            return (
              <div key={status}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="capitalize font-medium text-slate-700">
                      {status}
                    </span>
                    <span className="text-slate-500">
                      {count} ({percent}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2">
                    <div
                    className={`${colors[status as keyof typeof colors]} h-2 rounded-full`}
                    style={{
                      width: `${percent}%`
                    }}>
                  </div>
                  </div>
                </div>);

          })}
          </div>
        </div>
      </div>
    </div>;

  const renderPatients = () =>
  <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
            <tr>
              <th className="px-6 py-3 font-semibold">Patient Name</th>
              <th className="px-6 py-3 font-semibold">Contact</th>
              <th className="px-6 py-3 font-semibold">DOB</th>
              <th className="px-6 py-3 font-semibold">Total Requests</th>
              <th className="px-6 py-3 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {patients.map((p) =>
          <tr key={p.id} className="hover:bg-slate-50">
                <td className="px-6 py-4 font-medium text-slate-900">
                  {p.name}
                </td>
                <td className="px-6 py-4 text-slate-500">{p.email}</td>
                <td className="px-6 py-4 text-slate-500">
                  {new Date(p.dob).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 text-slate-500">
                  {requests.filter((r) => r.patientId === p.id).length}
                </td>
                <td className="px-6 py-4">
                  <button className="text-medical-blue hover:underline font-medium">
                    View Profile
                  </button>
                </td>
              </tr>
          )}
          </tbody>
        </table>
      </div>
    </div>;

  const renderAudit = () =>
  <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
            <tr>
              <th className="px-6 py-3 font-semibold">Timestamp</th>
              <th className="px-6 py-3 font-semibold">User</th>
              <th className="px-6 py-3 font-semibold">Role</th>
              <th className="px-6 py-3 font-semibold">Action</th>
              <th className="px-6 py-3 font-semibold">Details</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {auditLogs.map((log) =>
          <tr key={log.id} className="hover:bg-slate-50">
                <td className="px-6 py-4 text-slate-500 whitespace-nowrap">
                  {new Date(log.timestamp).toLocaleString()}
                </td>
                <td className="px-6 py-4 font-medium text-slate-900">
                  {log.user}
                </td>
                <td className="px-6 py-4 capitalize text-slate-500">
                  {log.role}
                </td>
                <td className="px-6 py-4 font-medium text-slate-700">
                  {log.action}
                </td>
                <td className="px-6 py-4 text-slate-500">{log.details}</td>
              </tr>
          )}
          </tbody>
        </table>
      </div>
    </div>;

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          Platform Administration
        </h1>
        <p className="text-slate-500">
          System overview, user management, and compliance monitoring.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-slate-100 p-1 rounded-xl w-fit">
        {[
        {
          id: 'overview',
          label: 'Overview'
        },
        {
          id: 'patients',
          label: 'Patient Directory'
        },
        {
          id: 'doctors',
          label: 'Provider Management'
        },
        {
          id: 'audit',
          label: 'Compliance & Audit'
        }].
        map((tab) =>
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id as TabType)}
          className={`px-5 py-2 text-sm font-medium rounded-lg transition-all ${activeTab === tab.id ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'}`}>
          
            {tab.label}
          </button>
        )}
      </div>

      {/* Content */}
      <motion.div
        key={activeTab}
        initial={{
          opacity: 0,
          y: 10
        }}
        animate={{
          opacity: 1,
          y: 0
        }}
        transition={{
          duration: 0.2
        }}>
        
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'patients' && renderPatients()}
        {activeTab === 'doctors' &&
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 text-center text-slate-500">
            Provider management interface would go here.
          </div>
        }
        {activeTab === 'audit' && renderAudit()}
      </motion.div>
    </div>);

};