import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <nav className='navbar backdrop'>
      <div className='container nav-inner'>
        <Link to='/jobs' className='brand'>JobPortal</Link>

      {user && user.role === 'recruiter' && (
        <>
          <Link to='/post-job' className='nav-link'>Post Job</Link>
          <Link to='/recruiter' className='nav-link'>Dashboard</Link>
        </>
      )}

      {user && user.role === 'candidate' && (
        <>
          <Link to='/candidate' className='nav-link'>Dashboard</Link>
        </>
      )}

      <div className='spacer'>
        {!token ? (
          <>
            <Link to='/login' className='btn btn-ghost' style={{ marginRight: 8 }}>Login</Link>
            <Link to='/register' className='btn btn-primary'>Register</Link>
          </>
        ) : (
          <button className='btn' onClick={logout}>Logout</button>
        )}
      </div>
      </div>
    </nav>
  );
}
