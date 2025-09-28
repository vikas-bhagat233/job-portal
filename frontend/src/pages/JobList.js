import React, { useEffect, useState } from 'react';
import API from '../api/api';
import JobCard from '../components/JobCard';

export default function JobList() {
  const [jobs, setJobs] = useState([]);
  const [search, setSearch] = useState('');

  const load = async () => {
    try {
      const res = await API.get('/jobs', { params: { search } });
      setJobs(res.data);
    } catch (err) {
      console.error(err);
      alert('Failed to load jobs');
    }
  };

  useEffect(() => { load(); }, [search]);

  return (
    <div className='container'>
      <h2 className='heading'>Find your next role</h2>
      <p className='muted' style={{ marginTop: 4, marginBottom: 12 }}>Search and explore open positions</p>
      <div className='card backdrop' style={{ marginBottom: 16 }}>
        <input className='input' placeholder='Search jobs (title, company, location)...' value={search} onChange={e => setSearch(e.target.value)} />
      </div>
      <div className='grid grid-2'>
        {jobs.map(j => <JobCard key={j._id} job={j} />)}
      </div>
    </div>
  );
}
