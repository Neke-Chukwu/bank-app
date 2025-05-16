import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const API_URL = 'https://api.neontrust.us/api/users';

const LogIn = () => {


  const [formData, setFormData] = useState({
    loginIdentifier: '',
    password: '',
    rememberMe: false,
  });
  const [errors, setErrors] = useState({
    loginIdentifier: '',
    password: '',
    general: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showError, setShowError] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    let valid = true;
    const newErrors = { ...errors };
    if (!formData.loginIdentifier.trim()) {
      newErrors.loginIdentifier = 'loginIdentifier or email is required';
      valid = false;
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
      valid = false;
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
      valid = false;
    }
    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setShowError(false);
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const res = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: formData.loginIdentifier,
          email: formData.loginIdentifier,
          password: formData.password,
        }),
      });
      const data = await res.json();
      console.log('LOGIN response:', res.status, data);

      if (!res.ok) {
        setErrors((prev) => ({ ...prev, general: data.message }));
        setShowError(true);
      } else {
        // Always store the token in localStorage
        localStorage.setItem('token', data.token);
        localStorage.setItem('role', data.role);

        // Redirect based on role (client-side)
        if (data.role === 'admin') {
          navigate('/admin', { replace: true });
        } else {
          navigate('/user', { replace: true });
        }
      }
    } catch (err) {
      console.error('LOGIN ERROR:', err);
      setErrors((prev) => ({ ...prev, general: 'Network error.' }));
      setShowError(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const togglePasswordVisibility = () => setShowPassword((v) => !v);

  return (
    <div className="container mt-5 pt-5">
      {/* Main Content */}
      <main className="flex-grow-1 d-flex align-items-center justify-content-center">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-12 col-md-8 col-lg-5">
              <div className="card">
                <div className="card-body">
                  <h2 className="text-center fw-bold" style={{ color: '#1A3D8F' }}>
                    Log in to Neon Trust Bank
                  </h2>
                  <p className="text-center text-muted">
                    Enter your credentials to access your account
                  </p>

                  {showError && (
                    <div className="alert alert-danger mt-3">
                      {errors.general}
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="mt-4">
                    <div className="mb-3">
                      <label htmlFor="username" className="form-label">
                        Username or Email
                      </label>
                      <div className="input-group">
                        <span className="input-group-text">
                          <i className="fas fa-user"></i>
                        </span>
                        <input
                          type="text"
                          id="loginIdentifier"
                          name="loginIdentifier"
                          value={formData.loginIdentifier}
                          onChange={handleChange}
                          className={`form-control ${errors.loginIdentifier ? 'is-invalid' : ''}`}
                          placeholder="Enter your username or email"
                        />
                      </div>
                      {errors.username && (
                        <div className="invalid-feedback">{errors.loginIdentifier}</div>
                      )}
                    </div>

                    <div className="mb-3">
                      <label htmlFor="password" className="form-label">
                        Password
                      </label>
                      <div className="input-group">
                        <span className="input-group-text">
                          <i className="fas fa-lock"></i>
                        </span>
                        <input
                          type={showPassword ? 'text' : 'password'}
                          id="password"
                          name="password"
                          value={formData.password}
                          onChange={handleChange}
                          className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                          placeholder="Enter your password"
                        />
                        <button
                          type="button"
                          className="btn"
                          onClick={togglePasswordVisibility}
                          style={{
                            border: 'none',
                            background: 'none',
                            outline: 'none',
                          }}
                        >
                          <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                        </button>
                      </div>
                      {errors.password && (
                        <div className="invalid-feedback">{errors.password}</div>
                      )}
                    </div>

                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <div className="form-check">
                        <input
                          type="checkbox"
                          id="remember-me"
                          name="rememberMe"
                          checked={formData.rememberMe}
                          onChange={handleChange}
                          className="form-check-input custom-check"
                        />
                        <label htmlFor="remember-me" className="form-check-label">
                          Remember me
                        </label>
                      </div>
                      <a href="mailto:support@neontrust.us" style={{ color: '#1A3D8F' }}>
                        Forgot Password? Contact Support
                      </a>
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="btn btn-primary w-100"
                      style={{ backgroundColor: '#1A3D8F', color: '#FFFFFF' }}
                    >
                      {isSubmitting ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2"></span>
                          Logging in...
                        </>
                      ) : (
                        'Log In'
                      )}
                    </button>
                  </form>

                  <div className="text-center mt-3">
                    <p className="text-muted">
                      Don't have an account?{' '}
                      <a href="/register" style={{ color: '#1A3D8F' }}>
                        Register now
                      </a>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Security Information */}
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-md-8 col-lg-5">
            <div className="bg-light px-4 py-5">
              <div className="d-flex justify-content-center align-items-center gap-3 mb-4">
                <div className="d-flex align-items-center text-success">
                  <i className="fas fa-lock me-2"></i>
                  <span className="small fw-medium">Secure Connection</span>
                </div>
                <div className="d-flex align-items-center text-success">
                  <i className="fas fa-shield-alt me-2"></i>
                  <span className="small fw-medium">Encrypted Data</span>
                </div>
                <div className="d-flex align-items-center text-success">
                  <i className="fas fa-user-shield me-2"></i>
                  <span className="small fw-medium">Protected Privacy</span>
                </div>
              </div>
              <p className="text-center text-muted small">
                Your connection to Neon Trust Bank is encrypted and secure. We use industry-standard security measures to protect your information.
              </p>
              <div className="text-center mt-3">
                <a href="#" className="text-decoration-none small" style={{ color: '#1A3D8F' }}>
                  Security Policy
                </a> •
                <a href="#" className="text-decoration-none small ms-2" style={{ color: '#1A3D8F' }}>
                  Terms of Service
                </a> •
                <a href="#" className="text-decoration-none small ms-2" style={{ color: '#1A3D8F' }}>
                  Privacy Policy
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogIn;
