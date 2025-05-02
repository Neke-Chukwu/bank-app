import React, { useState, useEffect } from "react";

const PayBillsForm = ({ onClose }) => {
  const [formData, setFormData] = useState({
    billerName: "",
    billerAccount: "",
    amountDue: "",
    paymentDate: "",
    paymentType: "One-Time",
    securityPin: "",
  });

  const [currentStep, setCurrentStep] = useState(1); // Tracks the current step of the form
  const [errors, setErrors] = useState({}); // Tracks validation errors
  const [isSubmitting, setIsSubmitting] = useState(false); // Tracks loading state
  const [isSubmitted, setIsSubmitted] = useState(false); // Tracks if the payment is submitted

  // Automatically set the current date for paymentDate
  useEffect(() => {
    const currentDate = new Date().toISOString().slice(0, 10); // Format: YYYY-MM-DD
    setFormData((prevData) => ({
      ...prevData,
      paymentDate: currentDate,
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
      if (!formData.billerName) stepErrors.billerName = "Biller name is required.";
      if (!formData.billerAccount) stepErrors.billerAccount = "Biller account number is required.";
    } else if (currentStep === 2) {
      if (!formData.amountDue) stepErrors.amountDue = "Amount due is required.";
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

  const handleSubmit = (e) => {
    e.preventDefault();
    const stepErrors = validateStep();
    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors);
    } else {
      setIsSubmitting(true); // Start loading
      setTimeout(() => {
        setIsSubmitting(false); // Stop loading
        setIsSubmitted(true); // Mark as submitted
        setTimeout(() => {
          onClose(); // Close the modal after showing the success message
        }, 3000); // Show success message for 3 seconds
      }, 5000); // Simulate 5 seconds of loading
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
            Processing Payment...
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
            Payment Submitted Successfully!
          </h4>
        </div>
      )}

      {/* Form */}
      {!isSubmitting && !isSubmitted && (
        <form onSubmit={handleSubmit}>
          {/* Step 1: Biller Information */}
          {currentStep === 1 && (
            <div>
              <h6>Biller Information</h6>
              <div className="form-group">
                <label htmlFor="billerName">Biller Name</label>
                <input
                  type="text"
                  id="billerName"
                  name="billerName"
                  value={formData.billerName}
                  onChange={handleInputChange}
                  className={`form-control ${errors.billerName ? "is-invalid" : ""}`}
                />
                {errors.billerName && <div className="invalid-feedback">{errors.billerName}</div>}
              </div>
              <div className="form-group">
                <label htmlFor="billerAccount">Account Number</label>
                <input
                  type="text"
                  id="billerAccount"
                  name="billerAccount"
                  value={formData.billerAccount}
                  onChange={handleInputChange}
                  className={`form-control ${errors.billerAccount ? "is-invalid" : ""}`}
                />
                {errors.billerAccount && <div className="invalid-feedback">{errors.billerAccount}</div>}
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

          {/* Step 2: Payment Details */}
          {currentStep === 2 && (
            <div>
              <h6>Payment Details</h6>
              <div className="form-group">
                <label htmlFor="amountDue">Amount Due</label>
                <input
                  type="text"
                  id="amountDue"
                  name="amountDue"
                  value={formData.amountDue}
                  onChange={handleInputChange}
                  className={`form-control ${errors.amountDue ? "is-invalid" : ""}`}
                />
                {errors.amountDue && <div className="invalid-feedback">{errors.amountDue}</div>}
              </div>
              <div className="form-group">
                <label htmlFor="paymentDate">Payment Date</label>
                <input
                  type="date"
                  id="paymentDate"
                  name="paymentDate"
                  value={formData.paymentDate}
                  onChange={handleInputChange}
                  className="form-control"
                  disabled // Prevent manual editing of the date
                />
              </div>
              <div className="form-group">
                <label htmlFor="paymentType">Payment Type</label>
                <select
                  id="paymentType"
                  name="paymentType"
                  value={formData.paymentType}
                  onChange={handleInputChange}
                  className="form-control"
                >
                  <option value="One-Time">One-Time</option>
                  <option value="Recurring">Recurring</option>
                </select>
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
                  Confirm Payment
                </button>
              </div>
            </div>
          )}
        </form>
      )}
    </div>
  );
};

export default PayBillsForm;