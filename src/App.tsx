import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { Layout } from './components/Layout';
// Patient
import { PatientIntake } from './pages/patient/PatientIntake';
import { PatientQuestionnaire } from './pages/patient/PatientQuestionnaire';
import { PatientPayment } from './pages/patient/PatientPayment';
import { PatientDashboard } from './pages/patient/PatientDashboard';
// Doctor
import { DoctorDashboard } from './pages/doctor/DoctorDashboard';
import { DoctorPatientDetail } from './pages/doctor/DoctorPatientDetail';
// Admin
import { AdminDashboard } from './pages/admin/AdminDashboard';
export function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            {/* Default redirect to patient dashboard */}
            <Route
              index
              element={<Navigate to="/patient/dashboard" replace />} />
            

            {/* Patient Routes */}
            <Route path="patient">
              <Route path="dashboard" element={<PatientDashboard />} />
              <Route path="intake" element={<PatientIntake />} />
              <Route
                path="questionnaire/:requestId"
                element={<PatientQuestionnaire />} />
              
              <Route path="payment/:requestId" element={<PatientPayment />} />
            </Route>

            {/* Doctor Routes */}
            <Route path="doctor">
              <Route path="dashboard" element={<DoctorDashboard />} />
              <Route
                path="patient/:requestId"
                element={<DoctorPatientDetail />} />
              
            </Route>

            {/* Admin Routes */}
            <Route path="admin">
              <Route path="dashboard" element={<AdminDashboard />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </AppProvider>);

}