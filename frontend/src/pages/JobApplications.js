import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import API from '../api/api';

export default function JobApplications() {
  const { jobId } = useParams();
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await API.get(`/applications/${jobId}`);
        setApps(data);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [jobId]);

  const markViewed = async (appId) => {
    try {
      const { data } = await API.patch(`/applications/status/${appId}/viewed`);
      setApps(prev => prev.map(a => a._id === appId ? data : a));
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    }
  };

  const updateStatus = async (appId, status) => {
    try {
      const { data } = await API.patch(`/applications/status/${appId}`, { status });
      setApps(prev => prev.map(a => a._id === appId ? data : a));
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    }
  };

  if (loading) return <div className='container'>Loading...</div>;
  if (error) return <div className='container' style={{ color: 'crimson' }}>Error: {error}</div>;

  return (
    <div className='container'>
      <div className='card backdrop' style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h2 className='heading' style={{ margin: 0 }}>Applications</h2>
        <Link className='btn' to={-1}>Back</Link>
      </div>
      <div className='grid' style={{ marginTop: 12 }}>
        {apps.length === 0 ? (
          <div className='card backdrop'>No applications yet.</div>
        ) : (
          apps.map(a => (
            <div key={a._id} className='card backdrop'>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, flexWrap: 'wrap' }}>
                <div><strong>{a.candidate?.name}</strong> — <span className='muted'>{a.candidate?.email}</span></div>
                <span className={`badge ${a.status === 'rejected' ? 'badge-danger' : a.status === 'shortlisted' ? 'badge-success' : 'badge-warn'}`}>Status: {a.status}</span>
              </div>
              <div style={{ marginTop: 8 }}>
                {a.resume ? (
                  <a className='btn' href={`${process.env.REACT_APP_API?.replace('/api','') || 'http://localhost:5000'}/uploads/${a.resume}`} target="_blank" rel="noreferrer">Resume</a>
                ) : (
                  <span className='muted'>No resume</span>
                )}
                {a.viewedAt && <span className='muted' style={{ marginLeft: 8, fontSize: 12 }}>Viewed: {new Date(a.viewedAt).toLocaleString()}</span>}
              </div>
              {a.coverLetter && (
                <div style={{ marginTop: 8 }}>
                  <strong>Cover Letter:</strong>
                  <div style={{ whiteSpace: 'pre-wrap' }}>{a.coverLetter}</div>
                </div>
              )}
              <div className='muted' style={{ fontSize: 12, marginTop: 6 }}>{new Date(a.createdAt).toLocaleString()}</div>
              <div style={{ marginTop: 12, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                <button className='btn' onClick={() => markViewed(a._id)} disabled={['rejected','hired'].includes(a.status)}>Mark Viewed</button>
                <button className='btn btn-danger' onClick={() => updateStatus(a._id, 'rejected')} disabled={['rejected','hired'].includes(a.status)}>Reject</button>
                <button className='btn' onClick={() => updateStatus(a._id, 'shortlisted')} disabled={['rejected','hired'].includes(a.status)}>Shortlist</button>
                <button className='btn btn-primary' onClick={() => updateStatus(a._id, 'hired')} disabled={['rejected','hired'].includes(a.status)}>Hire</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
