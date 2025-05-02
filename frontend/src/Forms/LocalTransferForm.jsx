import React, { useState, useEffect } from "react";

const LocalTransferForm = ({ onClose, userAccounts }) => {
  const [formData, setFormData] = useState({
    recipientName: "",
    recipientAccount: "",
    recipientBank: "",
    recipientRouting: "",
    amount: "",
    transferType: "Personal",
    transferDate: "",
    reference: "",
    securityPin: "",
  });

  const [currentStep, setCurrentStep] = useState(1); // Tracks the current step of the form
  const [errors, setErrors] = useState({}); // Tracks validation errors
  const [isSubmitting, setIsSubmitting] = useState(false); // Tracks loading state
  const [isSubmitted, setIsSubmitted] = useState(false); // Tracks if the transfer is submitted
  const [approvalStatus, setApprovalStatus] = useState("Pending"); // Tracks approval status

  // Automatically set the current date and time for transferDate
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
      if (!formData.recipientRouting) stepErrors.recipientRouting = "Recipient's routing number is required.";
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
    console.log("Submit button clicked"); // Debugging
  
    const stepErrors = validateStep();
    if (Object.keys(stepErrors).length > 0) {
      console.log("Validation errors:", stepErrors); // Debugging
      setErrors(stepErrors);
      return;
    }
  
    setIsSubmitting(true); // Start loading
  
    // Debugging: Log userAccounts
    console.log("User accounts:", userAccounts);
  
    // Find the Savings Account
    const savingsAccount =
      userAccounts && userAccounts.length > 0
        ? userAccounts.find((acc) => acc.type === "Savings Account")
        : null;
  
    if (!savingsAccount) {
      console.log("No Savings Account available."); // Debugging
      setErrors({ general: "No Savings Account available to debit from." });
      setIsSubmitting(false);
      return;
    }
  
    const transferData = {
      ...formData,
      debitedAccount: savingsAccount.number, // Use the Savings Account
    };
  
    try {
      console.log("Sending transfer data to backend:", transferData); // Debugging
  
      // Retrieve the token from localStorage
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No token found. Please log in again.");
      }
  
      const response = await fetch("http://localhost:5000/api/transfers/local", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Include the token in the Authorization header
        },
        body: JSON.stringify(transferData),
      });
  
      if (!response.ok) {
        throw new Error("Failed to process transfer.");
      }
  
      console.log("Transfer submitted successfully"); // Debugging
  
      // Simulate approval delay
      setTimeout(() => {
        setApprovalStatus("Approved");
        setIsSubmitted(true); // Mark as submitted
        setTimeout(() => {
          onClose(); // Close the modal after showing the success message
        }, 3000); // Show success message for 3 seconds
      }, 10000); // Approve after 10 seconds
    } catch (error) {
      console.error("Error processing transfer:", error);
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
            Transfer Approved Successfully!
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
                <label htmlFor="recipientRouting">Bank Routing Number</label>
                <input
                  type="text"
                  id="recipientRouting"
                  name="recipientRouting"
                  value={formData.recipientRouting}
                  onChange={handleInputChange}
                  className={`form-control ${errors.recipientRouting ? "is-invalid" : ""}`}
                />
                {errors.recipientRouting && <div className="invalid-feedback">{errors.recipientRouting}</div>}
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

export default LocalTransferForm;