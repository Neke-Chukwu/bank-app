import React, { useState } from 'react';
import ProfileForm from '../Forms/ProfileForm';

const PersonalInfoPage = () => {
  const [profile, setProfile] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    idDocument: null,
    profileImage: null,
    cardType: '',
  });

  const [preview, setPreview] = useState({
    profileImage: null,
    idDocument: null,
  });

  const [message, setMessage] = useState('');
  const [isLocked, setIsLocked] = useState(false); // Lock inputs after submission
  const [showCameraModal, setShowCameraModal] = useState(false);
  const [cameraType, setCameraType] = useState('');
  const canvasRef = React.useRef(null);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (files) {
      const file = files[0];
      setProfile({ ...profile, [name]: file });

      // Preview for images
      if (name === 'profileImage') {
        setPreview((prev) => ({
          ...prev,
          profileImage: URL.createObjectURL(file),
        }));
      }
      if (name === 'idDocument') {
        if (file.type.startsWith('image')) {
          setPreview((prev) => ({
            ...prev,
            idDocument: URL.createObjectURL(file),
          }));
        } else {
          setPreview((prev) => ({
            ...prev,
            idDocument: file.name,
          }));
        }
      }
    } else {
      setProfile({ ...profile, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      for (const key in profile) {
        formData.append(key, profile[key]);
      }

      const response = await fetch('https://your-backend-api.com/profile', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        setMessage('Profile submitted successfully!');
        setIsLocked(true); // Lock inputs after submission
      } else {
        const errorData = await response.json();
        setMessage(errorData.message || 'Failed to submit profile. Please try again.');
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage('An error occurred. Please try again later.');
    }
  };

  const openCamera = (type) => {
    setCameraType(type);
    setShowCameraModal(true);
  };

  const closeCamera = () => {
    setShowCameraModal(false);
  };

  const captureImage = () => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    const video = document.querySelector('video'); // Assuming a video element is used for the camera
    if (video) {
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
    }
    const imageData = canvas.toDataURL('image/png');
    if (cameraType === 'profileImage') {
      setPreview((prev) => ({ ...prev, profileImage: imageData }));
      setProfile((prev) => ({ ...prev, profileImage: imageData }));
    } else if (cameraType === 'idDocument') {
      setPreview((prev) => ({ ...prev, idDocument: imageData }));
      setProfile((prev) => ({ ...prev, idDocument: imageData }));
    }

    closeCamera();
  };

  return (
    <div
      className="container py-5"
      style={{
        maxWidth: '800px',
        margin: '0 auto',
        backgroundColor: '#f8f9fa',
        borderRadius: '10px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        padding: '20px',
      }}
    >
      <h1
        className="text-center mb-4"
        style={{ color: '#1A3D8F', fontWeight: 'bold' }}
      >
        Personal Information
      </h1>

      {message && (
        <div
          className={`alert ${
            message.includes('successfully') ? 'alert-success' : 'alert-danger'
          } text-center`}
        >
          {message}
        </div>
      )}

      <ProfileForm
        profile={profile}
        preview={preview}
        isLocked={isLocked}
        message={message}
        showCameraModal={showCameraModal}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        openCamera={openCamera}
        closeCamera={closeCamera}
        captureImage={captureImage}
        canvasRef={canvasRef}
      />
    </div>
  );
};

export default PersonalInfoPage;