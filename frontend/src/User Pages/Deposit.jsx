import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Suspended from "./Suspended";
import Modal from "../Components/Modal";

const DepositPage = () => {
  const [showCheckModal, setShowCheckModal] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [expectedDate, setExpectedDate] = useState("");
  const [copiedField, setCopiedField] = useState("");

  const [isSuspended, setIsSuspended] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const userResponse = await axios.get("https://api.neontrust.us/api/users/user", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (userResponse.data?.user?.status === false) {
          setIsSuspended(true);
          setLoading(false);
          return;
        }
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch user data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  if (isSuspended) {
    return <Suspended />;
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const handleCopy = async (label, value) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopiedField(label);
      setTimeout(() => setCopiedField(""), 2000);
    } catch (err) {
      console.error("Copy failed:", err);
    }
  };

  const calculateNextBusinessDay = (startDate, daysToAdd) => {
    let currentDate = new Date(startDate);
    let addedDays = 0;

    while (addedDays < daysToAdd) {
      currentDate.setDate(currentDate.getDate() + 1);
      const dayOfWeek = currentDate.getDay();
      if (dayOfWeek !== 0 && dayOfWeek !== 6) {
        // Skip weekends (Sunday = 0, Saturday = 6)
        addedDays++;
      }
    }

    return currentDate;
  };

  const handleSubmitCheck = () => {
    setIsLoading(true);
    const today = new Date();
    const nextBusinessDay = calculateNextBusinessDay(today, 3); // Add 3 business days
    const formattedDate = nextBusinessDay.toLocaleDateString("en-US", {
      weekday: "long",
      month: "short",
      day: "numeric",
      year: "numeric",
    });

    setTimeout(() => {
      setExpectedDate(formattedDate);
      setIsLoading(false);
      setShowSuccess(true);
    }, 5000); // Simulate 5-second loading
  };

  return (
    <div className="container py-5">
      {/* Page Title */}
      <h2 className="text-center mb-4" style={{ color: "#1A3D8F" }}>Deposit Funds</h2>

      {/* Deposit Options Section */}
      <div className="row">
        {/* Bank Deposit Info */}
        <div className="col-md-6 mb-4">
          <div className="p-4 rounded shadow-sm" style={{ backgroundColor: "#f8f9fa" }}>
            <div
              className="p-3 rounded-top"
              style={{
                backgroundColor: "#1A3D8F",
                color: "white",
                textAlign: "center",
              }}
            >
              <h5 className="mb-0">Account Details</h5>
            </div>
            <div className="p-3">
              <p className="text-muted">Use the following details to deposit funds from another bank or via payroll:</p>
              <div className="border p-3 rounded mb-3 d-flex justify-content-between align-items-center" style={{ backgroundColor: "#ffffff" }}>
                <strong>Bank Name:</strong>
                <div className="d-flex align-items-center">
                  <span className="me-2">Neon Trust Bank</span>
                  <button
                    className="btn btn-sm btn-outline-secondary d-flex align-items-center"
                    onClick={() => handleCopy("Bank Name", "Neon Trust Bank")}
                  >
                    <i className="fas fa-copy me-1"></i>
                    {copiedField === "Bank Name" ? "Copied!" : "Copy"}
                  </button>
                </div>
              </div>
              <div className="border p-3 rounded mb-3 d-flex justify-content-between align-items-center" style={{ backgroundColor: "#ffffff" }}>
                <strong>Routing Number:</strong>
                <div className="d-flex align-items-center">
                  <span className="me-2">123456789</span>
                  <button
                    className="btn btn-sm btn-outline-secondary d-flex align-items-center"
                    onClick={() => handleCopy("Routing Number", "123456789")}
                  >
                    <i className="fas fa-copy me-1"></i>
                    {copiedField === "Routing Number" ? "Copied!" : "Copy"}
                  </button>
                </div>
              </div>
              <div className="border p-3 rounded mb-3 d-flex justify-content-between align-items-center" style={{ backgroundColor: "#ffffff" }}>
                <strong>Account Number:</strong>
                <div className="d-flex align-items-center">
                  <span className="me-2">9876543210</span>
                  <button
                    className="btn btn-sm btn-outline-secondary d-flex align-items-center"
                    onClick={() => handleCopy("Account Number", "9876543210")}
                  >
                    <i className="fas fa-copy me-1"></i>
                    {copiedField === "Account Number" ? "Copied!" : "Copy"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Check Deposit Option */}
        <div className="col-md-6 mb-4">
          <div
            className="p-4 rounded shadow-sm text-center"
            style={{ backgroundColor: "#1A3D8F", color: "white" }}
          >
            <h5>Deposit a Check</h5>
            <p>Upload images of your check to deposit funds directly into your account.</p>
            <button
              className="btn btn-light btn-lg mt-3"
              style={{ borderRadius: "5px" }}
              onClick={() => setShowCheckModal(true)}
            >
              Deposit a Check
            </button>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="bg-light p-4 rounded shadow-sm mt-5">
        <h5 style={{ color: "#1A3D8F" }}>How It Works</h5>
        <ol className="text-muted">
          <li>Use the bank details provided to transfer funds from another bank.</li>
          <li>Alternatively, upload images of your check for mobile deposit.</li>
          <li>Funds will be processed and deposited into your account securely.</li>
        </ol>
      </div>

      {/* Modal for Check Upload */}
      <Modal
        isOpen={showCheckModal}
        onClose={() => {
          setShowCheckModal(false);
          setShowSuccess(false);
          setIsLoading(false);
        }}
        title="Mobile Check Deposit"
      >
        {!showSuccess ? (
          <>
            {!isLoading ? (
              <>
                <p className="mb-3">Upload clear images of the front and back of your check.</p>
                <div className="mb-3">
                  <label className="form-label">Front of Check</label>
                  <input type="file" className="form-control mb-2" accept="image/*"capture="environment" />
                </div>
                <div className="mb-3">
                  <label className="form-label">Back of Check</label>
                  <input type="file" className="form-control" accept="image/*"capture="environment" />
                </div>
                <div className="text-end mt-4">
                  <button
                    className="btn"
                    style={{
                      backgroundColor: "#1A3D8F",
                      color: "white",
                      borderRadius: "5px",
                    }}
                    onClick={handleSubmitCheck}
                  >
                    Submit Check
                  </button>
                </div>
              </>
            ) : (
              <div className="text-center">
                <i className="fas fa-spinner fa-spin text-primary mb-3" style={{ fontSize: "24px" }}></i>
                <p>Processing your check, please wait...</p>
              </div>
            )}
          </>
        ) : (
          <div className="text-center p-4 rounded shadow-sm" style={{ backgroundColor: "#f8f9fa" }}>
            <h5 className="text-success mb-3">
              <i className="fas fa-check-circle me-2"></i> Check Submitted Successfully!
            </h5>
            <p className="mb-1">Your check is being processed.</p>
            <p>Funds are expected in your account by <strong>{expectedDate}</strong>.</p>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default DepositPage;