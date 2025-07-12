import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ProfilePage = () => {
  const [profile, setProfile] = useState({
    username: '',
    email: '',
    phone: '',
    idDocument: { frontUrl: '', backUrl: '' },
    profilePicture: { data: null, contentType: '' },
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [profilePictureFile, setProfilePictureFile] = useState(null);
  const navigate = useNavigate();
  const brandColor = '#1A3D8F';
  const fileInputRef = useRef(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        console.log('Token from storage:', token);

        if (!token) {
          console.error('No authentication token found. Redirecting to login...');
          navigate('/login');
          return;
        }

        console.log('Fetching profile data from /api/users/user...');
        const response = await axios.get('http://localhost:5000/api/users/user', {
          headers: { Authorization: `Bearer ${token}` },
        });

        console.log('Profile data fetched successfully:', response.data.user);
        console.log('Profile picture:', response.data.user.profilePicture);
        setProfile({
          username: response.data.user.username || '',
          email: response.data.user.email || '',
          phone: response.data.user.phone || '',
          idDocument: response.data.user.idDocument || { frontUrl: '', backUrl: '' },
          profilePicture: response.data.user.profilePicture || { data: null, contentType: '' },
        });
      } catch (err) {
        console.error('Error fetching profile data:', {
          message: err.message,
          response: err.response?.data,
        });
        setError(err.response?.data?.message || 'Failed to fetch profile data');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  useEffect(() => {
    if (profilePictureFile) {
      console.log('profilePictureFile updated:', profilePictureFile);
      handleProfilePictureUpload(profilePictureFile);
    }
  }, [profilePictureFile]);

  const handleProfilePictureUpload = async (file) => {
    if (!file) {
      setError('Please select an image to upload.');
      return;
    }

    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (!token) {
      setError('No authentication token found. Please log in again.');
      navigate('/login');
      return;
    }

    // Clear input early to avoid ref loss
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    } else {
      console.warn('fileInputRef.current is null, cannot clear input');
    }

    const formData = new FormData();
    formData.append('profilePicture', file);

    try {
      setLoading(true);
      setError(null);
      setSuccess(null);
      console.log('Sending POST request to /api/users/upload with file:', file.name);
      const response = await axios.post('http://localhost:5000/api/users/upload', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log('POST request successful:', response.data);

      setProfile({
        ...profile,
        profilePicture: {
          data: response.data.user.profilePicture.data,
          contentType: response.data.user.profilePicture.contentType,
        },
      });
      setSuccess(response.data.message);
      setProfilePictureFile(null);
    } catch (err) {
      console.error('Error uploading profile picture:', {
        message: err.message,
        response: err.response ? {
          status: err.response.status,
          data: err.response.data,
        } : null,
      });
      setError(err.response?.data?.message || 'Failed to upload profile picture');
    } finally {
      setLoading(false);
    }
  };

  const handleEditButtonClick = () => {
    setError(null);
    setSuccess(null);
    console.log('Edit button clicked, fileInputRef:', fileInputRef.current);
    if (fileInputRef.current) {
      fileInputRef.current.click();
    } else {
      console.error('fileInputRef.current is null, cannot trigger file input');
      setError('Unable to open file picker. Please try again.');
    }
  };

  const handleEditProfile = () => {
    setError(null);
    setSuccess(null);
    navigate('/profile/edit');
  };

  // Auto-dismiss toasts
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  if (loading) {
    return (
      <div className="text-center mt-5">
        <div className="spinner-border" style={{ color: brandColor }} role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      {success && (
        <div
          className="toast align-items-center text-white bg-success border-0 position-fixed top-0 end-0 m-3 show"
          role="alert"
          aria-live="assertive"
          aria-atomic="true"
          style={{ zIndex: 1050 }}
        >
          <div className="d-flex">
            <div className="toast-body">{success}</div>
            <button
              type="button"
              className="btn-close btn-close-white me-2 m-auto"
              onClick={() => setSuccess(null)}
              aria-label="Close"
            ></button>
          </div>
        </div>
      )}
      {error && (
        <div
          className="toast align-items-center text-white bg-danger border-0 position-fixed top-0 end-0 m-3 show"
          role="alert"
          aria-live="assertive"
          aria-atomic="true"
          style={{ zIndex: 1050 }}
        >
          <div className="d-flex">
            <div className="toast-body">
              {error}{' '}
              <a href="#" onClick={() => navigate(-1)} style={{ color: '#fff', textDecoration: 'underline' }}>
                Go back
              </a>
            </div>
            <button
              type="button"
              className="btn-close btn-close-white me-2 m-auto"
              onClick={() => setError(null)}
              aria-label="Close"
            ></button>
          </div>
        </div>
      )}
      <div
        className="card shadow-lg p-4 mx-auto"
        style={{
          maxWidth: '800px',
          border: `2px solid ${brandColor}`,
          borderRadius: '10px',
        }}
      >
        <h1
          className="text-center mb-4"
          style={{ color: brandColor, fontWeight: 'bold' }}
        >
          Profile Information
        </h1>
        <div className="row g-4">
          <div className="col-md-4 text-center position-relative">
            <img
              src={
                profile.profilePicture.data
                  ? `data:${profile.profilePicture.contentType};base64,${profile.profilePicture.data}`
                  : '/Profile.png'
              }
              alt="Profile"
              className="img-fluid rounded-circle"
              style={{ width: '150px', height: '150px', objectFit: 'cover' }}
              onError={() => console.error('Failed to load profile picture')}
              onLoad={() => console.log('Profile picture loaded successfully')}
            />
            <button
              className="btn btn-sm position-absolute"
              style={{
                bottom: '10px',
                right: '10px',
                backgroundColor: brandColor,
                color: '#fff',
                borderRadius: '50%',
                width: '30px',
                height: '30px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '0',
              }}
              onClick={handleEditButtonClick}
              title="Edit Profile Picture"
            >
              <i className="fas fa-pencil-alt" style={{ fontSize: '14px' }}></i>
            </button>
            <input
              type="file"
              ref={fileInputRef}
              className="d-none"
              accept="image/jpeg,image/png,image/gif"
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  console.log('File selected:', file);
                  setProfilePictureFile(file);
                }
              }}
            />
          </div>
          <div className="col-md-8">
            <h5 style={{ color: brandColor }}>Personal Details</h5>
            <p>
              <strong>Username:</strong> {profile.username || 'N/A'}
            </p>
            <p>
              <strong>Email:</strong> {profile.email || 'N/A'}
            </p>
            <p>
              <strong>Phone:</strong> {profile.phone || 'Not provided'}
            </p>
          </div>
        </div>
        <hr />
        <div className="row g-4">
          <div className="col-md-6">
            <h5 style={{ color: brandColor }}>ID Document (Front)</h5>
            {profile.idDocument.frontUrl ? (
              <img
                src={profile.idDocument.frontUrl}
                alt="ID Document Front"
                className="img-fluid rounded"
                style={{ maxWidth: '100%' }}
              />
            ) : (
              <p>Not provided</p>
            )}
          </div>
          <div className="col-md-6">
            <h5 style={{ color: brandColor }}>ID Document (Back)</h5>
            {profile.idDocument.backUrl ? (
              <img
                src={profile.idDocument.backUrl}
                alt="ID Document Back"
                className="img-fluid rounded"
                style={{ maxWidth: '100%' }}
              />
            ) : (
              <p>Not provided</p>
            )}
          </div>
        </div>
        <div className="mt-4 text-center">
          <button
            className="btn"
            style={{
              backgroundColor: brandColor,
              color: '#fff',
              borderColor: brandColor,
            }}
            onClick={handleEditProfile}
          >
            Edit Profile
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;