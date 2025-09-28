import React, { useState } from 'react';
import API from '../api/api';
import { useNavigate } from 'react-router-dom';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'candidate' });
  const navigate = useNavigate();

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async e => {
    e.preventDefault();
    try {
      await API.post('/auth/register', form);
      alert('Registered — please login');
      navigate('/login');
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    }
  };

  return (
    <div className='container' style={{ maxWidth: 640 }}>
      <div className='card backdrop fade-in'>
        <h2 className='heading'>Create your account</h2>
        <form onSubmit={submit} style={{ marginTop: 12 }}>
          <div style={{ marginBottom: 12 }}>
            <label>Name</label>
            <input className='input' name='name' value={form.name} onChange={handleChange} required />
          </div>
          <div style={{ marginBottom: 12 }}>
            <label>Email</label>
            <input className='input' name='email' type='email' value={form.email} onChange={handleChange} required />
          </div>
          <div style={{ marginBottom: 12 }}>
            <label>Password</label>
            <input className='input' name='password' type='password' value={form.password} onChange={handleChange} required />
          </div>
          <div style={{ marginBottom: 16 }}>
            <label>Role</label>
            <select className='input' name='role' value={form.role} onChange={handleChange}>
              <option value='candidate'>Candidate</option>
              <option value='recruiter'>Recruiter</option>
            </select>
          </div>
          <button className='btn btn-primary' type='submit'>Register</button>
        </form>
      </div>
    </div>
  );
}
