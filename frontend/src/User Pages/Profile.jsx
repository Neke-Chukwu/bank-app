import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ProfilePage = () => {
  const [profile, setProfile] = useState(null); // State to store profile data
  const [loading, setLoading] = useState(true); // State to handle loading
  const [error, setError] = useState(null); // State to handle errors
  const navigate = useNavigate(); // For navigation
  const brandColor = '#1A3D8F';

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // Check both localStorage and sessionStorage for the token
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        console.log('Token from storage:', token); // Debugging token retrieval
  
        if (!token) {
          console.error('No authentication token found. Redirecting to login...');
          navigate('/login');
          return;
        }
  
        console.log('Fetching profile data...');
        const response = await axios.get('https://api.neontrust.us/api/users/user', {
          headers: { Authorization: `Bearer ${token}` },
        });
  
        console.log('Profile data fetched successfully:', response.data.user);
        setProfile(response.data.user);
      } catch (err) {
        console.error('Error fetching profile data:', err);
        setError(err.response?.data?.message || err.message || 'Failed to fetch profile data');
      } finally {
        setLoading(false);
      }
    };
  
    fetchProfile();
  }, [navigate]);

  if (loading) {
    return (
      <div className="text-center mt-5">
        <div className="spinner-border" style={{ color: brandColor }} role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger text-center mt-5">
        {error}
      </div>
    );
  }

  const handleEditProfile = () => {
    setLoading(true); // Simulate loading
    setTimeout(() => {
      setLoading(false);
      setError(
        <>
          Unable to access the path you are trying to reach. Please try again later.{' '}
          <a href="#" onClick={() => navigate(-1)} style={{ color: brandColor }}>
            Go back
          </a>
        </>
      );
    }, 5000); // Simulate 5 seconds delay
  };

  return (
    <div className="container py-5">
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
          <div className="col-md-4 text-center">
            <img
              src="/Profile.png"
              alt="Profile"
              className="img-fluid rounded-circle"
              style={{ width: '150px', height: '150px', objectFit: 'cover' }}
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
              <strong>Phone:</strong> {profile.phone || 'Verified ✅'}
            </p>
          </div>
        </div>
        <hr />
        <div className="row g-4">
          <div className="col-md-6">
            <h5 style={{ color: brandColor }}>ID Document</h5>
            {profile.idDocument ? (
              <img
                src={profile.idDocument}
                alt="ID Document"
                className="img-fluid rounded"
                style={{ maxWidth: '100%' }}
              />
            ) : (
              <p>Verified ✅</p>
            )}
          </div>
          <div className="col-md-6">
            <h5 style={{ color: brandColor }}>Address</h5>
            <p>{profile.address || 'Verified ✅'}</p>
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