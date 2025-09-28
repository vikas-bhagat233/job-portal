import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import JobList from './pages/JobList';
import JobDetails from './pages/JobDetails';
import PostJob from './pages/PostJob';
import RecruiterDashboard from './pages/RecruiterDashboard';
import CandidateDashboard from './pages/CandidateDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import JobApplications from './pages/JobApplications';

function BodyClassController() {
  const location = useLocation();
  useEffect(() => {
    const path = location.pathname;
    const body = document.body;
    body.classList.remove('page-login','page-register','page-jobs','page-job-details','page-post-job','page-recruiter','page-candidate','page-applications');
    if (path.startsWith('/login')) body.classList.add('page-login');
    else if (path.startsWith('/register')) body.classList.add('page-register');
    else if (path === '/' || path.startsWith('/jobs') && !/\/jobs\/.+/.test(path)) body.classList.add('page-jobs');
    else if (/\/jobs\/.+/.test(path)) body.classList.add('page-job-details');
    else if (path.startsWith('/post-job')) body.classList.add('page-post-job');
    else if (path.startsWith('/recruiter')) body.classList.add('page-recruiter');
    else if (path.startsWith('/candidate')) body.classList.add('page-candidate');
    else if (path.startsWith('/applications')) body.classList.add('page-applications');
  }, [location]);
  return null;
}

export default function App() {
  // Smart home: if logged in, go to their dashboard; else go to login
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  const home = token && user ? (user.role === 'recruiter' ? '/recruiter' : '/candidate') : '/login';

  return (
    <Router>
      <div>
        <BodyClassController />
        <Navbar />
        <Routes>
          <Route path="/" element={<Navigate to={home} replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/jobs" element={<JobList />} />
          <Route path="/jobs/:id" element={<JobDetails />} />
          <Route
            path="/post-job"
            element={
              <ProtectedRoute roles={["recruiter"]}>
                <PostJob />
              </ProtectedRoute>
            }
          />
          <Route
            path="/recruiter"
            element={
              <ProtectedRoute roles={["recruiter"]}>
                <RecruiterDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/applications/job/:jobId"
            element={
              <ProtectedRoute roles={["recruiter"]}>
                <JobApplications />
              </ProtectedRoute>
            }
          />
          <Route
            path="/candidate"
            element={
              <ProtectedRoute roles={["candidate"]}>
                <CandidateDashboard />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to={home} replace />} />
        </Routes>
      </div>
    </Router>
  );
}
