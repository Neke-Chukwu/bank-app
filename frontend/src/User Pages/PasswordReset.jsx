import React, { useState } from 'react';
import PasswordResetForm from '../Forms/PasswordResetForm';

const PasswordReset = () => {
  const [message, setMessage] = useState(null); // State for success message
  const [error, setError] = useState(null); // State for error message

  const handlePasswordReset = async (formData) => {
    try {
      // Replace with your backend API endpoint
      const response = await fetch('https://api.neontrust.us/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to reset password.');
      }

      setMessage('Password reset successful! You can now log in with your new password.');
      setError(null);
    } catch (error) {
      console.error('Error resetting password:', error);
      setMessage(null);
      setError(error.message || 'An error occurred while resetting the password.');
    }
  };

  return (
    <div className="container py-5">
      {message && <div className="alert alert-success text-center">{message}</div>}
      {error && <div className="alert alert-danger text-center">{error}</div>}
      <PasswordResetForm onSubmit={handlePasswordReset} />
    </div>
  );
};

export default PasswordReset;