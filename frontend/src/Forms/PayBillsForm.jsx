import React, { useState, useEffect } from "react";
import axios from "axios";

const PayBillsForm = ({ onClose }) => {
  const [formData, setFormData] = useState({
    billerName: "",
    billerAccount: "",
    recipientBank: "",
    amountDue: "",
    currency: "USD", // Default currency
    paymentDate: "",
    paymentType: "One-Time",
    billType: "", // e.g., Utility, Internet
    reference: "", // Optional reference
    securityPin: "",
  });
  const [currentStep, setCurrentStep] = useState(1);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submissionError, setSubmissionError] = useState(null);

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
    setSubmissionError(null); // Clear submission error on input change
  };

  const validateStep = () => {
    const stepErrors = {};
    if (currentStep === 1) {
      if (!formData.billerName) stepErrors.billerName = "Biller name is required.";
      if (!formData.billerAccount) stepErrors.billerAccount = "Biller account number is required.";
      if (!formData.recipientBank) stepErrors.recipientBank = "Biller bank is required.";
      if (!formData.billType) stepErrors.billType = "Bill type is required.";
    } else if (currentStep === 2) {
      if (!formData.amountDue || formData.amountDue <= 0) {
        stepErrors.amountDue = "A valid amount is required.";
      }
      if (!formData.currency) stepErrors.currency = "Currency is required.";
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
    setSubmissionError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const stepErrors = validateStep();
    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors);
      return;
    }

    setIsSubmitting(true);
    setSubmissionError(null);

    try {
      const token = localStorage.getItem("token") || sessionStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found. Please log in.");
      }

      const payload = {
        recipientName: formData.billerName,
        recipientAccount: formData.billerAccount,
        recipientBank: formData.recipientBank,
        amount: parseFloat(formData.amountDue),
        currency: formData.currency,
        transferDate: formData.paymentDate,
        reference: formData.reference || `Bill Payment - ${formData.billerName}`,
        billType: formData.billType,
      };

      await axios.post(
        "http://localhost:5000/api/transfers/payBill",
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      // Backend simulates approval after 5 seconds
      await new Promise((resolve) => setTimeout(resolve, 5000));

      setIsSubmitting(false);
      setIsSubmitted(true);

      // Close modal after showing success message for 3 seconds
      setTimeout(() => {
        onClose();
      }, 3000);
    } catch (error) {
      setIsSubmitting(false);
      setSubmissionError(
        error.response?.data?.message || error.message || "Failed to process payment."
      );
    }
  };

  return (
    <div className="container">
      {/* Loading State */}
      {isSubmitting && (
        <div className="card shadow-sm p-4 mb-4 text-center">
          <div className="spinner-border text-primary mb-3" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <h5>Processing Payment...</h5>
        </div>
      )}

      {/* Success Message */}
      {isSubmitted && (
        <div className="card shadow-sm p-4 mb-4 text-center">
          <i className="fas fa-check-circle fa-3x text-success mb-3"></i>
          <h5>Payment Submitted Successfully!</h5>
        </div>
      )}

      {/* Error Message */}
      {submissionError && !isSubmitting && !isSubmitted && (
        <div className="alert alert-danger mb-4" role="alert">
          {submissionError}
        </div>
      )}

      {/* Form */}
      {!isSubmitting && !isSubmitted && (
        <div className="card shadow-sm p-4">
          {currentStep === 1 && (
            <div>
              <h5 className="mb-4">Biller Information</h5>
              <div className="mb-3">
                <label className="form-label">Biller Name</label>
                <input
                  type="text"
                  className={`form-control ${errors.billerName ? "is-invalid" : ""}`}
                  name="billerName"
                  value={formData.billerName}
                  onChange={handleInputChange}
                  placeholder="Enter biller name"
                />
                {errors.billerName && (
                  <div className="invalid-feedback">{errors.billerName}</div>
                )}
              </div>
              <div className="mb-3">
                <label className="form-label">Account Number</label>
                <input
                  type="text"
                  className={`form-control ${errors.billerAccount ? "is-invalid" : ""}`}
                  name="billerAccount"
                  value={formData.billerAccount}
                  onChange={handleInputChange}
                  placeholder="Enter biller account number"
                />
                {errors.billerAccount && (
                  <div className="invalid-feedback">{errors.billerAccount}</div>
                )}
              </div>
              <div className="mb-3">
                <label className="form-label">Biller Bank</label>
                <input
                  type="text"
                  className={`form-control ${errors.recipientBank ? "is-invalid" : ""}`}
                  name="recipientBank"
                  value={formData.recipientBank}
                  onChange={handleInputChange}
                  placeholder="Enter biller bank"
                />
                {errors.recipientBank && (
                  <div className="invalid-feedback">{errors.recipientBank}</div>
                )}
              </div>
              <div className="mb-3">
                <label className="form-label">Bill Type</label>
                <select
                  className={`form-select ${errors.billType ? "is-invalid" : ""}`}
                  name="billType"
                  value={formData.billType}
                  onChange={handleInputChange}
                >
                  <option value="">Select bill type</option>
                  <option value="Utility">Utility</option>
                  <option value="Internet">Internet</option>
                  <option value="Phone">Phone</option>
                  <option value="Other">Other</option>
                </select>
                {errors.billType && (
                  <div className="invalid-feedback">{errors.billType}</div>
                )}
              </div>
              <button className="btn btn-primary w-100" onClick={handleNext}>
                Next
              </button>
            </div>
          )}

          {currentStep === 2 && (
            <div>
              <h5 className="mb-4">Payment Details</h5>
              <div className="mb-3">
                <label className="form-label">Amount Due</label>
                <div className="input-group">
                  <span className="input-group-text">$</span>
                  <input
                    type="number"
                    className={`form-control ${errors.amountDue ? "is-invalid" : ""}`}
                    name="amountDue"
                    value={formData.amountDue}
                    onChange={handleInputChange}
                    placeholder="Enter amount"
                    min="0"
                    step="0.01"
                  />
                  {errors.amountDue && (
                    <div className="invalid-feedback">{errors.amountDue}</div>
                  )}
                </div>
              </div>
              <div className="mb-3">
                <label className="form-label">Currency</label>
                <select
                  className={`form-select ${errors.currency ? "is-invalid" : ""}`}
                  name="currency"
                  value={formData.currency}
                  onChange={handleInputChange}
                >
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                  <option value="GBP">GBP</option>
                </select>
                {errors.currency && (
                  <div className="invalid-feedback">{errors.currency}</div>
                )}
              </div>
              <div className="mb-3">
                <label className="form-label">Payment Date</label>
                <input
                  type="date"
                  className="form-control"
                  name="paymentDate"
                  value={formData.paymentDate}
                  onChange={handleInputChange}
                  disabled
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
              <div className="mb-3">
                <label className="form-label">Reference (Optional)</label>
                <input
                  type="text"
                  className="form-control"
                  name="reference"
                  value={formData.reference}
                  onChange={handleInputChange}
                  placeholder="Enter reference"
                />
              </div>
              <div className="d-flex justify-content-between">
                <button className="btn btn-secondary" onClick={handlePrevious}>
                  Previous
                </button>
                <button className="btn btn-primary" onClick={handleNext}>
                  Next
                </button>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div>
              <h5 className="mb-4">Security Verification</h5>
              <div className="mb-3">
                <label className="form-label">Security PIN</label>
                <input
                  type="password"
                  className={`form-control ${errors.securityPin ? "is-invalid" : ""}`}
                  name="securityPin"
                  value={formData.securityPin}
                  onChange={handleInputChange}
                  placeholder="Enter your PIN"
                />
                {errors.securityPin && (
                  <div className="invalid-feedback">{errors.securityPin}</div>
                )}
              </div>
              <div className="d-flex justify-content-between">
                <button className="btn btn-secondary" onClick={handlePrevious}>
                  Previous
                </button>
                <button
                  className="btn btn-primary"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                >
                  Confirm Payment
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PayBillsForm;