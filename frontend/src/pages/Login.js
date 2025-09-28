import React, { useState } from 'react';
import API from '../api/api';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async e => {
    e.preventDefault();
    try {
      const { data } = await API.post('/auth/login', form);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      if (data.user.role === 'recruiter') navigate('/recruiter');
      else navigate('/candidate');
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    }
  };

  return (
    <div className='container' style={{ maxWidth: 640 }}>
      <div className='card backdrop fade-in'>
        <h2 className='heading'>Welcome back</h2>
        <form onSubmit={submit} style={{ marginTop: 12 }}>
          <div style={{ marginBottom: 12 }}>
            <label>Email</label>
            <input className='input' name='email' value={form.email} onChange={handleChange} required />
          </div>
          <div style={{ marginBottom: 12 }}>
            <label>Password</label>
            <input className='input' name='password' type='password' value={form.password} onChange={handleChange} required />
          </div>
          <button className='btn btn-primary' type='submit'>Login</button>
        </form>
      </div>
    </div>
  );
}
