import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import API from '../api/api';

export default function JobDetails() {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [resume, setResume] = useState(null);
  const [coverLetter, setCoverLetter] = useState('');
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  const load = async () => {
    try {
      const res = await API.get(`/jobs/${id}`);
      setJob(res.data);
    } catch (err) {
      console.error(err);
      alert('Failed to load job');
    }
  };

  useEffect(() => { load(); }, [id]);

  const apply = async e => {
    e.preventDefault();
    try {
      const fd = new FormData();
      if (resume) fd.append('resume', resume);
      fd.append('coverLetter', coverLetter);
      await API.post(`/applications/${id}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      alert('Applied successfully');
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    }
  };

  if (!job) return <div className='container'>Loading...</div>;

  return (
    <div className='container' style={{ maxWidth: 900 }}>
      <div className='card backdrop fade-in'>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          <h2 className='heading' style={{ margin: 0 }}>{job.title}</h2>
          <span className={`badge ${job.status === 'closed' ? 'badge-danger' : 'badge-success'}`}>{job.status}</span>
        </div>
        <p className='muted' style={{ marginTop: 4 }}>{job.company} • {job.location || 'Remote/Anywhere'}</p>
        {job.seats !== undefined && job.seats !== null && (
          <div style={{ marginTop: 6 }}>
            <span className={`badge ${job.remainingSeats === 0 ? 'badge-warn' : 'badge-success'}`}>
              Seats remaining: {(job.remainingSeats ?? job.seats)}/{job.seats}
            </span>
          </div>
        )}
        <p style={{ marginTop: 12, whiteSpace: 'pre-wrap' }}>{job.description}</p>

        {user?.role === 'candidate' && job.status !== 'closed' && (job.seats === undefined || job.seats === null || (job.remainingSeats ?? 0) > 0) && (
          <div style={{ marginTop: 18 }}>
            <h3 className='heading' style={{ marginTop: 0 }}>Apply</h3>
            <form onSubmit={apply}>
              <div style={{ marginBottom: 12 }}>
                <label>Resume (pdf/doc)</label>
                <input className='input' type='file' accept='.pdf,.doc,.docx' onChange={e => setResume(e.target.files[0])} />
              </div>
              <div style={{ marginBottom: 12 }}>
                <label>Cover Letter</label>
                <textarea className='input' value={coverLetter} onChange={e => setCoverLetter(e.target.value)} rows={5} />
              </div>
              <button className='btn btn-primary' type='submit'>Apply</button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
