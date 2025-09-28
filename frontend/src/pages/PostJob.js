import React, { useState } from 'react';
import API from '../api/api';
import { useNavigate } from 'react-router-dom';

export default function PostJob() {
  const [form, setForm] = useState({ title: '', company: '', location: '', salary: '', description: '', seats: '' });
  const navigate = useNavigate();

  const handle = e => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async e => {
    e.preventDefault();
    try {
      await API.post('/jobs', form);
      alert('Job posted');
      navigate('/recruiter');
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    }
  };

  return (
    <div className='container' style={{ maxWidth: 800 }}>
      <div className='card backdrop fade-in'>
        <h2 className='heading'>Post a job</h2>
        <form onSubmit={submit} style={{ marginTop: 12 }}>
          <div className='grid grid-2'>
            <div>
              <label>Title</label>
              <input className='input' name='title' value={form.title} onChange={handle} required />
            </div>
            <div>
              <label>Company</label>
              <input className='input' name='company' value={form.company} onChange={handle} required />
            </div>
            <div>
              <label>Location</label>
              <input className='input' name='location' value={form.location} onChange={handle} />
            </div>
            <div>
              <label>Salary</label>
              <input className='input' name='salary' value={form.salary} onChange={handle} />
            </div>
            <div>
              <label>Seats (number of hires)</label>
              <input className='input' name='seats' type='number' min='0' value={form.seats} onChange={handle} placeholder='e.g. 100' />
            </div>
          </div>
          <div style={{ marginTop: 12 }}>
            <label>Description</label>
            <textarea className='input' name='description' value={form.description} onChange={handle} rows={6} required />
          </div>
          <div style={{ marginTop: 16 }}>
            <button className='btn btn-primary' type='submit'>Post</button>
          </div>
        </form>
      </div>
    </div>
  );
}
