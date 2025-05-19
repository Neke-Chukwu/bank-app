import React, { useState } from 'react';
import RegistrationForm from '../Forms/RegistrationForm';
import { useNavigate } from 'react-router-dom';

const API_URL = 'http://localhost:5000/api/users/register'; 

const Register = () => {
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const brandColor = '#1A3D8F';

  const handleFormSubmit = async (formData) => {
    try {
      const response = await fetch(`${API_URL}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData), // now only { username, password }
      });
      const data = await response.json();
      console.log('REGISTER response:', response.status, data);

      if (response.ok) {
        setMessage('Registration successful! Redirecting…');
        setTimeout(() => navigate('/login', { replace: true }), 1500);
      } else {
        setMessage(data.message || 'Registration failed. Please try again.');
      }
    } catch (error) {
      console.error('REGISTER ERROR:', error);
      setMessage('An error occurred. Please try again later.');
    }
  };

  return (
    <div className="container my-3 pt-5">
      <div
        className="card shadow-lg p-4 mx-auto"
        style={{
          maxWidth: '500px',
          border: `2px solid ${brandColor}`,
          borderRadius: '10px',
        }}
      >
        <h1
          className="text-center mb-4"
          style={{ color: brandColor, fontWeight: 'bold' }}
        >
          Register
        </h1>
        <p className="text-center text-muted">
          Create a new Neon Trust Bank account to get started.
        </p>

        {message && (
          <div
            className={`alert ${
              message.includes('successful') ? 'alert-success' : 'alert-danger'
            } text-center`}
          >
            {message}
          </div>
        )}

        <RegistrationForm onSubmit={handleFormSubmit} />

        <p className="text-center mt-3">
          Already have an account?{' '}
          <a href="/login" style={{ color: brandColor, fontWeight: 'bold' }}>
            Log in here
          </a>
          .
        </p>
      </div>
    </div>
  );
};

export default Register;
