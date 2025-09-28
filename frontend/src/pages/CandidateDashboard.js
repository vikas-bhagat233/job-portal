import React, { useEffect, useState } from 'react';
import API from '../api/api';
import { Link } from 'react-router-dom';

export default function CandidateDashboard() {
  const [apps, setApps] = useState([]);

  const load = async () => {
    try {
      const res = await API.get('/applications/me');
      setApps(res.data);
    } catch (err) {
      console.error(err);
      alert('Failed to load applications');
    }
  };

  useEffect(() => { load(); }, []);

  return (
    <div className='container'>
      <div className='card backdrop'>
        <h2 className='heading' style={{ margin: 0 }}>Your Applications</h2>
      </div>
      <div className='grid' style={{ marginTop: 12 }}>
        {apps.map(a => {
          const j = a.job;
          return (
            <div key={a._id} className='card backdrop'>
              <h3 style={{ margin: 0 }}>{j ? j.title : 'Job removed'}</h3>
              <div className='muted' style={{ marginTop: 4 }}>
                {j ? (
                  <>{j.company} • {j.location || '—'}</>
                ) : (
                  'This job is no longer available'
                )}
              </div>
              <div style={{ marginTop: 10 }}>
                {a.resume ? (
                  <a className='btn' href={`${process.env.REACT_APP_API?.replace('/api','') || 'http://localhost:5000'}/uploads/${a.resume}`} target='_blank' rel='noreferrer'>Resume</a>
                ) : (
                  <span className='muted'>No resume</span>
                )}
              </div>
              <div style={{ marginTop: 8 }}>
                <span className={`badge ${a.status === 'rejected' ? 'badge-danger' : a.status === 'shortlisted' ? 'badge-success' : 'badge-warn'}`}>Status: {a.status}</span>
                {a.viewedAt && <span className='muted' style={{ marginLeft: 8, fontSize: 12 }}>Viewed: {new Date(a.viewedAt).toLocaleString()}</span>}
              </div>
            </div>
          );
        })}
      </div>
      <div style={{ marginTop: 12 }}>
        <Link className='btn btn-primary' to='/jobs'>Browse Jobs</Link>
      </div>
    </div>
  );
}
