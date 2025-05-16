import React, { useState, useEffect } from "react";
import axios from "axios";

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
  const [currentStep, setCurrentStep] = useState(1);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [apiError, setApiError] = useState(null);

  // Set current date for transferDate
  useEffect(() => {
    const currentDate = new Date().toISOString().slice(0, 10);
    setFormData((prevData) => ({
      ...prevData,
      transferDate: currentDate,
    }));
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    // Restrict recipientAccount and securityPin to digits only
    if (name === "recipientAccount" || name === "securityPin") {
      if (!/^\d*$/.test(value)) return;
    }
    // Restrict recipientSwift to alphanumeric
    if (name === "recipientSwift") {
      if (!/^[A-Za-z0-9]*$/.test(value)) return;
    }
    // Restrict recipientIban to alphanumeric
    if (name === "recipientIban") {
      if (!/^[A-Za-z0-9]*$/.test(value)) return;
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
      if (!formData.recipientName) stepErrors.recipientName = "Recipient's name is required.";
      if (!formData.recipientAccount) stepErrors.recipientAccount = "Recipient's account number is required.";
      else if (!/^\d{9}$/.test(formData.recipientAccount))
        stepErrors.recipientAccount = "Account number must be exactly 9 digits.";
      if (!formData.recipientBank) stepErrors.recipientBank = "Recipient's bank name is required.";
      if (!formData.recipientSwift) stepErrors.recipientSwift = "SWIFT/BIC code is required.";
      else if (!/^[A-Za-z0-9]{8}$|^[A-Za-z0-9]{11}$/.test(formData.recipientSwift))
        stepErrors.recipientSwift = "SWIFT/BIC code must be 8 or 11 characters.";
      if (!formData.recipientIban) stepErrors.recipientIban = "IBAN is required.";
      else if (!/^[A-Za-z0-9]{15,34}$/.test(formData.recipientIban))
        stepErrors.recipientIban = "IBAN must be 15-34 alphanumeric characters.";
      if (!formData.recipientCountry) stepErrors.recipientCountry = "Recipient's country is required.";
    } else if (currentStep === 2) {
      if (!formData.amount) stepErrors.amount = "Transfer amount is required.";
      else if (parseFloat(formData.amount) <= 0) stepErrors.amount = "Amount must be greater than 0.";
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
        recipientName: formData.recipientName,
        recipientAccount: formData.recipientAccount,
        recipientBank: formData.recipientBank,
        recipientSwift: formData.recipientSwift,
        recipientIban: formData.recipientIban,
        recipientCountry: formData.recipientCountry,
        amount: parseFloat(formData.amount),
        currency: formData.currency,
        transferType: formData.transferType,
        transferDate: formData.transferDate,
        reference: formData.reference || `INTL-${Date.now()}`,
      };

      console.log("Submitting international transfer:", payload);

      const response = await axios.post(
        "https://api.neontrust.us/api/transfers/international",
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
      console.error("Error submitting international transfer:", error);
      // Ensure loading state lasts at least 3 seconds even on error
      await new Promise((resolve) => setTimeout(resolve, 3000));
      setIsSubmitting(false);
      setApiError(error.response?.data?.message || error.message || "Failed to process transfer.");
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
          {/* API Error */}
          {apiError && (
            <div className="alert alert-danger" role="alert">
              {apiError}
            </div>
          )}

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
                  maxLength="9"
                  minLength="9"
                  placeholder="Enter 9-digit account number"
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
                  maxLength="11"
                  minLength="8"
                  placeholder="Enter 8 or 11-character SWIFT code"
                />
                {errors.recipientSwift && <div className="invalid-feedback">{errors.recipientSwift}</div>}
              </div>
              <div className="form-group">
                <label htmlFor="recipientIban">IBAN</label>
                <input
                  type="text"
                  id="recipientIban"
                  name="recipientIban"
                  value={formData.recipientIban}
                  onChange={handleInputChange}
                  className={`form-control ${errors.recipientIban ? "is-invalid" : ""}`}
                  maxLength="34"
                  minLength="15"
                  placeholder="Enter 15-34 character IBAN"
                />
                {errors.recipientIban && <div className="invalid-feedback">{errors.recipientIban}</div>}
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
                  type="number"
                  id="amount"
                  name="amount"
                  value={formData.amount}
                  onChange={handleInputChange}
                  className={`form-control ${errors.amount ? "is-invalid" : ""}`}
                  min="0"
                  step="0.01"
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
                <label htmlFor="transferType">Transfer Type</label>
                <select
                  id="transferType"
                  name="transferType"
                  value={formData.transferType}
                  onChange={handleInputChange}
                  className="form-control"
                >
                  <option value="Personal">Personal</option>
                  <option value="Business">Business</option>
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
                  disabled
                />
              </div>
              <div className="form-group">
                <label htmlFor="reference">Reference (Optional)</label>
                <input
                  type="text"
                  id="reference"
                  name="reference"
                  value={formData.reference}
                  onChange={handleInputChange}
                  className="form-control"
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
                  maxLength="4"
                  minLength="4"
                  placeholder="Enter 4-digit PIN"
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