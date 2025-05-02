import React, { useState, useEffect } from "react";

const InternationalTransferForm = ({ onClose }) => {
  const [formData, setFormData] = useState({
    recipientName: "",
    recipientAccount: "",
    recipientBank: "",
    recipientSwift: "",
    recipientIban: "",
    recipientCountry: "",
    amount: "",
    currency: "USD",
    transferType: "Personal",
    transferDate: "",
    reference: "",
    securityPin: "",
  });

  const [currentStep, setCurrentStep] = useState(1); // Tracks the current step of the form
  const [errors, setErrors] = useState({}); // Tracks validation errors
  const [isSubmitting, setIsSubmitting] = useState(false); // Tracks loading state
  const [isSubmitted, setIsSubmitted] = useState(false); // Tracks if the transfer is submitted
  const [approvalStatus, setApprovalStatus] = useState(""); // Tracks the approval status

  // Automatically set the current date for transferDate
  useEffect(() => {
    const currentDate = new Date().toISOString().slice(0, 10); // Format: YYYY-MM-DD
    setFormData((prevData) => ({
      ...prevData,
      transferDate: currentDate,
    }));
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    setErrors({
      ...errors,
      [name]: "", // Clear the error for the field being updated
    });
  };

  const validateStep = () => {
    const stepErrors = {};
    if (currentStep === 1) {
      if (!formData.recipientName) stepErrors.recipientName = "Recipient's name is required.";
      if (!formData.recipientAccount) stepErrors.recipientAccount = "Recipient's account number is required.";
      if (!formData.recipientBank) stepErrors.recipientBank = "Recipient's bank name is required.";
      if (!formData.recipientSwift) stepErrors.recipientSwift = "SWIFT/BIC code is required.";
      if (!formData.recipientCountry) stepErrors.recipientCountry = "Recipient's country is required.";
    } else if (currentStep === 2) {
      if (!formData.amount) stepErrors.amount = "Transfer amount is required.";
    } else if (currentStep === 3) {
      if (!formData.securityPin) stepErrors.securityPin = "Security PIN is required.";
    }
    return stepErrors;
  };

  const handleNext = () => {
    const stepErrors = validateStep();
    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors);
    } else {
      setCurrentStep((prevStep) => prevStep + 1);
    }
  };

  const handlePrevious = () => {
    setCurrentStep((prevStep) => prevStep - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const stepErrors = validateStep();
    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors);
      return;
    }

    setIsSubmitting(true); // Start loading

    const transferData = {
      ...formData,
    };

    try {
      console.log("Sending international transfer data to backend:", transferData); // Debugging

      // Retrieve the token from localStorage
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No token found. Please log in again.");
      }

      const response = await fetch("http://localhost:5000/api/auth/transfers/international", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Include the token in the Authorization header
        },
        body: JSON.stringify(transferData),
      });

      if (!response.ok) {
        throw new Error("Failed to process international transfer.");
      }

      console.log("International transfer submitted successfully"); // Debugging

      // Simulate approval delay
      setTimeout(() => {
        setApprovalStatus("Approved"); // Update approval status
        setIsSubmitted(true); // Mark as submitted
        setTimeout(() => {
          onClose(); // Close the modal after showing the success message
        }, 3000); // Show success message for 3 seconds
      }, 5000); // Simulate 5 seconds of loading
    } catch (error) {
      console.error("Error processing international transfer:", error);
      setErrors({ general: error.message });
    } finally {
      setIsSubmitting(false); // Stop loading
    }
  };

  return (
    <div className="modal-body mt-3">
      {/* Loading State */}
      {isSubmitting && (
        <div
          className="d-flex flex-column justify-content-center align-items-center"
          style={{
            width: "100%",
            height: "100%",
            backgroundColor: "white",
            borderRadius: "10px",
            padding: "20px",
          }}
        >
          <div
            className="spinner-border"
            style={{ width: "3rem", height: "3rem", color: "#1A3D8F" }}
            role="status"
          >
            <span className="visually-hidden">Loading...</span>
          </div>
          <h5 className="mt-3" style={{ color: "#1A3D8F" }}>
            Processing Transfer...
          </h5>
        </div>
      )}

      {/* Success Message */}
      {isSubmitted && (
        <div
          className="d-flex flex-column justify-content-center align-items-center"
          style={{
            width: "100%",
            height: "100%",
            backgroundColor: "white",
            borderRadius: "10px",
            padding: "20px",
          }}
        >
          <i className="fas fa-check-circle" style={{ fontSize: "4rem", color: "#1A3D8F" }}></i>
          <h4 className="mt-3" style={{ color: "#1A3D8F" }}>
            Transfer Submitted Successfully!
          </h4>
        </div>
      )}

      {/* Form */}
      {!isSubmitting && !isSubmitted && (
        <form onSubmit={handleSubmit}>
          {/* Step 1: Recipient's Information */}
          {currentStep === 1 && (
            <div>
              <h6>Recipient's Information</h6>
              <div className="form-group">
                <label htmlFor="recipientName">Full Name</label>
                <input
                  type="text"
                  id="recipientName"
                  name="recipientName"
                  value={formData.recipientName}
                  onChange={handleInputChange}
                  className={`form-control ${errors.recipientName ? "is-invalid" : ""}`}
                />
                {errors.recipientName && <div className="invalid-feedback">{errors.recipientName}</div>}
              </div>
              <div className="form-group">
                <label htmlFor="recipientAccount">Account Number</label>
                <input
                  type="text"
                  id="recipientAccount"
                  name="recipientAccount"
                  value={formData.recipientAccount}
                  onChange={handleInputChange}
                  className={`form-control ${errors.recipientAccount ? "is-invalid" : ""}`}
                />
                {errors.recipientAccount && <div className="invalid-feedback">{errors.recipientAccount}</div>}
              </div>
              <div className="form-group">
                <label htmlFor="recipientBank">Bank Name</label>
                <input
                  type="text"
                  id="recipientBank"
                  name="recipientBank"
                  value={formData.recipientBank}
                  onChange={handleInputChange}
                  className={`form-control ${errors.recipientBank ? "is-invalid" : ""}`}
                />
                {errors.recipientBank && <div className="invalid-feedback">{errors.recipientBank}</div>}
              </div>
              <div className="form-group">
                <label htmlFor="recipientSwift">SWIFT/BIC Code</label>
                <input
                  type="text"
                  id="recipientSwift"
                  name="recipientSwift"
                  value={formData.recipientSwift}
                  onChange={handleInputChange}
                  className={`form-control ${errors.recipientSwift ? "is-invalid" : ""}`}
                />
                {errors.recipientSwift && <div className="invalid-feedback">{errors.recipientSwift}</div>}
              </div>
              <div className="form-group">
                <label htmlFor="recipientCountry">Recipient's Country</label>
                <input
                  type="text"
                  id="recipientCountry"
                  name="recipientCountry"
                  value={formData.recipientCountry}
                  onChange={handleInputChange}
                  className={`form-control ${errors.recipientCountry ? "is-invalid" : ""}`}
                />
                {errors.recipientCountry && <div className="invalid-feedback">{errors.recipientCountry}</div>}
              </div>
              <button
                type="button"
                className="btn w-100 mt-3"
                style={{ backgroundColor: "#1A3D8F", color: "white" }}
                onClick={handleNext}
              >
                Next
              </button>
            </div>
          )}

          {/* Step 2: Transfer Details */}
          {currentStep === 2 && (
            <div>
              <h6>Transfer Details</h6>
              <div className="form-group">
                <label htmlFor="amount">Amount</label>
                <input
                  type="text"
                  id="amount"
                  name="amount"
                  value={formData.amount}
                  onChange={handleInputChange}
                  className={`form-control ${errors.amount ? "is-invalid" : ""}`}
                />
                {errors.amount && <div className="invalid-feedback">{errors.amount}</div>}
              </div>
              <div className="form-group">
                <label htmlFor="currency">Currency</label>
                <select
                  id="currency"
                  name="currency"
                  value={formData.currency}
                  onChange={handleInputChange}
                  className="form-control"
                >
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                  <option value="GBP">GBP</option>
                  <option value="AUD">AUD</option>
                  <option value="CAD">CAD</option>
                  <option value="INR">INR</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="transferDate">Transfer Date</label>
                <input
                  type="date"
                  id="transferDate"
                  name="transferDate"
                  value={formData.transferDate}
                  onChange={handleInputChange}
                  className="form-control"
                  disabled // Prevent manual editing of the date
                />
              </div>
              <div className="d-flex justify-content-between mt-3">
                <button
                  type="button"
                  className="btn"
                  style={{ backgroundColor: "#1A3D8F", color: "white" }}
                  onClick={handlePrevious}
                >
                  Previous
                </button>
                <button
                  type="button"
                  className="btn"
                  style={{ backgroundColor: "#1A3D8F", color: "white" }}
                  onClick={handleNext}
                >
                  Next
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Security Verification */}
          {currentStep === 3 && (
            <div>
              <h6>Security Verification</h6>
              <div className="form-group">
                <label htmlFor="securityPin">Security PIN</label>
                <input
                  type="password"
                  id="securityPin"
                  name="securityPin"
                  value={formData.securityPin}
                  onChange={handleInputChange}
                  className={`form-control ${errors.securityPin ? "is-invalid" : ""}`}
                />
                {errors.securityPin && <div className="invalid-feedback">{errors.securityPin}</div>}
              </div>
              <div className="d-flex justify-content-between mt-3">
                <button
                  type="button"
                  className="btn"
                  style={{ backgroundColor: "#1A3D8F", color: "white" }}
                  onClick={handlePrevious}
                >
                  Previous
                </button>
                <button
                  type="submit"
                  className="btn"
                  style={{ backgroundColor: "#1A3D8F", color: "white" }}
                >
                  Submit Transfer
                </button>
              </div>
            </div>
          )}
        </form>
      )}
    </div>
  );
};

export default InternationalTransferForm;