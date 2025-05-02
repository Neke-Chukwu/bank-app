import React, { useState, useEffect } from "react";
import axios from "axios";

const PayBillsForm = ({ onClose }) => {
  const [formData, setFormData] = useState({
    billerName: "",
    billerAccount: "",
    amountDue: "",
    paymentDate: "",
    paymentType: "One-Time",
    securityPin: "",
  });
  const [currentStep, setCurrentStep] = useState(1);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [apiError, setApiError] = useState(null);

  // Set current date for paymentDate
  useEffect(() => {
    const currentDate = new Date().toISOString().slice(0, 10);
    setFormData((prevData) => ({
      ...prevData,
      paymentDate: currentDate,
    }));
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    // Restrict billerAccount and securityPin to digits only
    if (name === "billerAccount" || name === "securityPin") {
      if (!/^\d*$/.test(value)) return; // Allow only digits
    }
    setFormData({
      ...formData,
      [name]: value,
    });
    setErrors({
      ...errors,
      [name]: "",
    });
    setApiError(null);
  };

  const validateStep = () => {
    const stepErrors = {};
    if (currentStep === 1) {
      if (!formData.billerName) stepErrors.billerName = "Biller name is required.";
      if (!formData.billerAccount) stepErrors.billerAccount = "Biller account number is required.";
      else if (!/^\d{9}$/.test(formData.billerAccount))
        stepErrors.billerAccount = "Account number must be exactly 9 digits.";
    } else if (currentStep === 2) {
      if (!formData.amountDue) stepErrors.amountDue = "Amount due is required.";
      else if (parseFloat(formData.amountDue) <= 0) stepErrors.amountDue = "Amount must be greater than 0.";
    } else if (currentStep === 3) {
      if (!formData.securityPin) stepErrors.securityPin = "Security PIN is required.";
      else if (!/^\d{4}$/.test(formData.securityPin))
        stepErrors.securityPin = "PIN must be exactly 4 digits.";
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
    setApiError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const stepErrors = validateStep();
    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors);
      return;
    }

    setIsSubmitting(true);
    setApiError(null);

    try {
      const token = localStorage.getItem("token") || sessionStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found. Please log in.");
      }

      const payload = {
        recipientName: formData.billerName,
        recipientAccount: formData.billerAccount,
        recipientBank: "Unknown",
        amount: parseFloat(formData.amountDue),
        currency: "USD",
        transferDate: formData.paymentDate,
        reference: `BILL-${Date.now()}`,
        billType: formData.paymentType,
      };

      console.log("Submitting bill payment:", payload);

      const response = await axios.post(
        "http://localhost:5000/api/transfers/payBill",
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("API response:", response.data);

      // Ensure loading state lasts at least 3 seconds
      await new Promise((resolve) => setTimeout(resolve, 3000));

      setIsSubmitting(false);
      setIsSubmitted(true);

      // Wait for backend approval simulation (5 seconds from success display)
      setTimeout(() => {
        onClose();
      }, 5000);
    } catch (error) {
      console.error("Error submitting bill payment:", error);
      // Ensure loading state lasts at least 3 seconds even on error
      await new Promise((resolve) => setTimeout(resolve, 3000));
      setIsSubmitting(false);
      setApiError(error.response?.data?.message || error.message || "Failed to process payment.");
    }
  };

  return (
    <div className="container p-4">
      {/* Loading State */}
      {isSubmitting && (
        <div className="text-center">
          <div className="spinner-border text-primary mb-3" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="h6">Processing Payment...</p>
        </div>
      )}

      {/* Success Message */}
      {isSubmitted && (
        <div className="text-center">
          <i className="fas fa-check-circle fa-3x text-success mb-3"></i>
          <p className="h6">Payment Submitted Successfully!</p>
        </div>
      )}

      {/* Form */}
      {!isSubmitting && !isSubmitted && (
        <form onSubmit={handleSubmit}>
          {/* API Error */}
          {apiError && (
            <div className="alert alert-danger" role="alert">
              {apiError}
            </div>
          )}

          {/* Step 1: Biller Information */}
          {currentStep === 1 && (
            <div>
              <h6 className="mb-4">Biller Information</h6>
              <div className="mb-3">
                <label className="form-label">Biller Name</label>
                <input
                  type="text"
                  className="form-control"
                  name="billerName"
                  value={formData.billerName}
                  onChange={handleInputChange}
                />
                {errors.billerName && <div className="text-danger">{errors.billerName}</div>}
              </div>
              <div className="mb-3">
                <label className="form-label">Account Number</label>
                <input
                  type="text"
                  className="form-control"
                  name="billerAccount"
                  value={formData.billerAccount}
                  onChange={handleInputChange}
                  maxLength="9"
                  minLength="9"
                  placeholder="Enter 9-digit account number"
                />
                {errors.billerAccount && <div className="text-danger">{errors.billerAccount}</div>}
              </div>
              <button type="button" className="btn btn-primary w-100" onClick={handleNext}>
                Next
              </button>
            </div>
          )}

          {/* Step 2: Payment Details */}
          {currentStep === 2 && (
            <div>
              <h6 className="mb-4">Payment Details</h6>
              <div className="mb-3">
                <label className="form-label">Amount Due</label>
                <input
                  type="number"
                  className="form-control"
                  name="amountDue"
                  value={formData.amountDue}
                  onChange={handleInputChange}
                  min="0"
                  step="0.01"
                />
                {errors.amountDue && <div className="text-danger">{errors.amountDue}</div>}
              </div>
              <div className="mb-3">
                <label className="form-label">Payment Date</label>
                <input
                  type="date"
                  className="form-control"
                  name="paymentDate"
                  value={formData.paymentDate}
                  onChange={handleInputChange}
                  readOnly
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Payment Type</label>
                <select
                  className="form-select"
                  name="paymentType"
                  value={formData.paymentType}
                  onChange={handleInputChange}
                >
                  <option value="One-Time">One-Time</option>
                  <option value="Recurring">Recurring</option>
                </select>
              </div>
              <div className="d-flex justify-content-between">
                <button type="button" className="btn btn-secondary" onClick={handlePrevious}>
                  Previous
                </button>
                <button type="button" className="btn btn-primary" onClick={handleNext}>
                  Next
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Security Verification */}
          {currentStep === 3 && (
            <div>
              <h6 className="mb-4">Security Verification</h6>
              <div className="mb-3">
                <label className="form-label">Security PIN</label>
                <input
                  type="password"
                  className="form-control"
                  name="securityPin"
                  value={formData.securityPin}
                  onChange={handleInputChange}
                  maxLength="4"
                  minLength="4"
                  placeholder="Enter 4-digit PIN"
                />
                {errors.securityPin && <div className="text-danger">{errors.securityPin}</div>}
              </div>
              <div className="d-flex justify-content-between">
                <button type="button" className="btn btn-secondary" onClick={handlePrevious}>
                  Previous
                </button>
                <button type="submit" className="btn btn-primary">
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