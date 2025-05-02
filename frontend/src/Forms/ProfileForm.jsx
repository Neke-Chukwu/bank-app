import React, { useState } from 'react';

const ProfileForm = ({ handleSubmit, brandColor }) => {
  const [step, setStep] = useState(1); // Track the current step
  const [profile, setProfile] = useState({
    fullName: '',
    email: '',
    phone: '',
    profileImage: null,
    idDocument: null,
  });

  const [preview, setPreview] = useState({
    profileImage: null,
    idDocument: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (files) {
      const file = files[0];
      setProfile((prev) => ({ ...prev, [name]: file }));

      // Generate preview for images
      if (name === 'profileImage' || name === 'idDocument') {
        setPreview((prev) => ({
          ...prev,
          [name]: URL.createObjectURL(file),
        }));
      }
    } else {
      setProfile((prev) => ({ ...prev, [name]: value }));
    }
  };

  const nextStep = () => setStep((prevStep) => prevStep + 1);
  const prevStep = () => setStep((prevStep) => prevStep - 1);

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div>
            <h5 className="mb-4" style={{ color: brandColor }}>
              Personal Details
            </h5>
            <div className="mb-3">
              <label htmlFor="fullName" className="form-label">
                Full Name
              </label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                className="form-control"
                value={profile.fullName}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className="form-control"
                value={profile.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="phone" className="form-label">
                Phone
              </label>
              <input
                type="text"
                id="phone"
                name="phone"
                className="form-control"
                value={profile.phone}
                onChange={handleChange}
                required
              />
            </div>
          </div>
        );
      case 2:
        return (
          <div>
            <h5 className="mb-4" style={{ color: brandColor }}>
              Upload Profile Picture
            </h5>
            <div className="mb-3">
              <label htmlFor="profileImage" className="form-label">
                Profile Picture
              </label>
              <input
                type="file"
                id="profileImage"
                name="profileImage"
                className="form-control"
                onChange={handleChange}
                accept="image/*"
              />
              {preview.profileImage && (
                <img
                  src={preview.profileImage}
                  alt="Profile Preview"
                  className="img-fluid mt-3 rounded"
                  style={{ maxWidth: '200px' }}
                />
              )}
            </div>
          </div>
        );
      case 3:
        return (
          <div>
            <h5 className="mb-4" style={{ color: brandColor }}>
              Upload ID Document
            </h5>
            <div className="mb-3">
              <label htmlFor="idDocument" className="form-label">
                ID Document
              </label>
              <input
                type="file"
                id="idDocument"
                name="idDocument"
                className="form-control"
                onChange={handleChange}
                accept="image/*,application/pdf"
              />
              {preview.idDocument && (
                <img
                  src={preview.idDocument}
                  alt="ID Preview"
                  className="img-fluid mt-3 rounded"
                  style={{ maxWidth: '200px' }}
                />
              )}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div>
      <form onSubmit={(e) => handleSubmit(e, profile)}>
        {renderStep()}
        <div className="d-flex justify-content-between mt-4">
          {step > 1 && (
            <button
              type="button"
              className="btn"
              style={{
                backgroundColor: "#1A3D8F",
                color: '#fff',}}
              onClick={prevStep}
            >
              Previous
            </button>
          )}
          {step < 3 ? (
            <button
              type="button"
              className="btn"
              style={{
                backgroundColor:  "#1A3D8F",
                color: '#fff',
                borderColor:  "#1A3D8F",
              }}
              onClick={nextStep}
            >
              Next
            </button>
          ) : (
            <button
              type="submit"
              className="btn"
              style={{
                backgroundColor: "#1A3D8F",
                color: '#fff',
                borderColor:  "#1A3D8F",
              }}
            >
              Submit
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default ProfileForm;