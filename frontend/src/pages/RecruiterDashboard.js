import React, { useEffect, useState } from 'react';
import API from '../api/api';
import { Link } from 'react-router-dom';

export default function RecruiterDashboard() {
  const [jobs, setJobs] = useState([]);

  const load = async () => {
    try {
      const res = await API.get('/jobs/recruiter/me');
      setJobs(res.data);
    } catch (err) {
      console.error(err);
      alert('Failed to load your jobs');
    }
  };

  useEffect(() => { load(); }, []);

  const toggleStatus = async (job) => {
    const next = job.status === 'open' ? 'closed' : 'open';
    if (!window.confirm(`Set job to ${next}?`)) return;
    try {
      await API.patch(`/jobs/${job._id}/status`, { status: next });
      setJobs(prev => prev.map(j => j._id === job._id ? { ...j, status: next } : j));
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    }
  };

  return (
    <div className='container'>
      <div className='card backdrop' style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h2 className='heading' style={{ margin: 0 }}>Your Jobs</h2>
        <Link className='btn btn-primary' to='/post-job'>Post new job</Link>
      </div>
      <div className='grid' style={{ marginTop: 12 }}>
        {jobs.map(j => (
          <div key={j._id} className='card backdrop'>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <h3 style={{ margin: 0 }}>{j.title}</h3>
              <span className={`badge ${j.status === 'open' ? 'badge-success' : 'badge-danger'}`}>{j.status}</span>
            </div>
            <div className='muted' style={{ marginTop: 4 }}>{j.company} • {j.location || '—'}</div>
            {j.seats !== undefined && j.seats !== null && (
              <div style={{ marginTop: 6 }}>
                <span className='badge'>Seats: {(j.remainingSeats ?? j.seats)}/{j.seats}</span>
              </div>
            )}
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 12 }}>
              <Link className='btn' to={`/jobs/${j._id}`}>View</Link>
              <Link className='btn' to={`/applications/job/${j._id}`}>View Applications</Link>
              <button className='btn btn-ghost' onClick={() => toggleStatus(j)}>
                {j.status === 'open' ? 'Close Job' : 'Reopen Job'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
