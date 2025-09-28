import React from 'react';
import { Link } from 'react-router-dom';

export default function JobCard({ job }) {
  return (
    <div className='card fade-in'>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 12 }}>
        <h3 className='heading'>{job.title}</h3>
        {job.status === 'closed' ? (
          <span className='badge badge-warn'>Closed</span>
        ) : (job.seats !== undefined && job.seats !== null) ? (
          <span className={`badge ${job.remainingSeats === 0 ? 'badge-warn' : 'badge-success'}`}>
            {job.remainingSeats ?? job.seats}/{job.seats} seats left
          </span>
        ) : null}
      </div>
      <p className='muted' style={{ margin: '4px 0 8px' }}>{job.company} • {job.location}</p>
      <p style={{ marginTop: 8 }}>
        {job.description?.slice(0, 150)}{job.description && job.description.length > 150 ? '...' : ''}
      </p>
      <Link className='btn' to={`/jobs/${job._id}`}>View</Link>
    </div>
  );
}
