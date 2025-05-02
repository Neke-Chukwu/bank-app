import React, { useState, useEffect } from "react";
import LoanHistoryTable from "../Components/LoanHistory";
import TransactionHistoryTable from "../Components/TransactionHistoryTable";
import Modal from "../Components/Modal"; // Import your custom modal component

export default function ManageUsers() {
  const brandColor = "#1A3D8F";

  // User status state
  const [userStatus, setUserStatus] = useState("active");
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false); // State for delete modal
  const [lastStatusUpdate, setLastStatusUpdate] = useState("");
  const [selectedUser, setSelectedUser] = useState(null); // Track the selected user for deletion

  // Personal information state
  const [personalInfo] = useState({
    name: selectedUser?.name || "John Doe",
    email: selectedUser?.email || "",
    phone: selectedUser?.phone || "",
    address: selectedUser?.address || "",
    idVerified: true,
    idCardFront: "",
    idCardBack: "",
  });

  // Deposit functionality
  const [selectedAccount, setSelectedAccount] = useState("checking");
  const [depositAmount, setDepositAmount] = useState("");

  const handleDeposit = async () => {
    if (!depositAmount || parseFloat(depositAmount) <= 0) {
      alert("Please enter a valid deposit amount.");
      return;
    }
  
    try {
      const response = await fetch("http://localhost:5000/users/${_id}/accounts/fund", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          // Use the selected user's ID
          accountType: selectedAccount === "checking" 
            ? "Checking Account" 
            : selectedAccount === "savings" 
              ? "Savings Account" 
              : selectedAccount === "investment" 
                ? "Investment Account" 
                : "", // Map frontend values to backend
          amount: parseFloat(depositAmount),
        }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        alert(`Deposit failed: ${errorData.message || "An error occurred"}`);
        return;
      }
  
      const successData = await response.json();
      alert(successData.message); // Display success message
      setDepositAmount(""); // Clear the input field
      // Optionally, you might want to refresh user data here to show the updated balance
    } catch (error) {
      console.error("Error processing deposit:", error);
      alert("Failed to process deposit. Please try again.");
    }
  };

  // Handle user status toggle
  const handleStatusToggle = () => {
    setShowStatusModal(true);
  };

  const confirmStatusChange = () => {
    const newStatus = userStatus === "active" ? "suspended" : "active";
    setUserStatus(newStatus);
    setLastStatusUpdate(
      new Date().toLocaleString("en-US", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      })
    );
    setShowStatusModal(false);
  };

  // Handle delete account
  const handleDeleteAccount = () => {
    setSelectedUser(personalInfo); // Set the user to be deleted
    setShowDeleteModal(true);
  };

  const confirmDeleteAccount = () => {
    console.log(`User account for ${selectedUser.name} deleted`);
    setShowDeleteModal(false);
    // Add logic to delete the user account from the database or state
  };

  // State for contact form submissions
  const [contactSubmissions, setContactSubmissions] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state

    // Fetch contact form submissions from the database
    useEffect(() => {
      const fetchSubmissions = async () => {
        try {
          setLoading(true);
          setError(null);
  
          // Simulate an API call to fetch submissions
          const response = await fetch("/api/contact-submissions"); // Replace with your API endpoint
          if (!response.ok) {
            throw new Error("Failed to fetch contact submissions");
          }
  
          const data = await response.json();
          setContactSubmissions(data);
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };
  
      fetchSubmissions();
    }, []);

  return (
    <div className="container py-5">
      {/* Header */}
      <header className="mb-4">
        <h1 className="text-primary">Admin Dashboard</h1>
      </header>

      {/* Account Management Section */}
      <div className="row g-4">
        {/* User Status Card */}
        <div className="col-md-6">
          <div className="card shadow-sm">
            <div className="card-body">
              <h5 className="card-title">Account Status</h5>
              <p className="card-text text-muted">Last updated: {lastStatusUpdate}</p>
              <span
                className={`badge ${
                  userStatus === "active" ? "bg-success" : "bg-danger"
                }`}
              >
                {userStatus.toUpperCase()}
              </span>
              <button
                className={`btn mt-3 w-100 ${
                  userStatus === "active" ? "btn-danger" : "btn-success"
                }`}
                onClick={handleStatusToggle}
              >
                {userStatus === "active" ? "Suspend Account" : "Activate Account"}
              </button>
              <button
                className="btn btn-danger mt-3 w-100"
                onClick={handleDeleteAccount}
              >
                Delete Account
              </button>
            </div>
          </div>
        </div>

        {/* Deposit Management Card */}
        <div className="col-md-6">
          <div className="card shadow-sm">
            <div className="card-body">
              <h5 className="card-title">Deposit Management</h5>
              <div className="mb-3">
                <label className="form-label">Account Type</label>
                <select
                  className="form-select"
                  value={selectedAccount}
                  onChange={(e) => setSelectedAccount(e.target.value)}
                >
                  <option value="checking">Checking Account</option>
                  <option value="savings">Savings Account</option>
                  <option value="investment">Investment Account</option>
                </select>
              </div>
              <div className="mb-3">
                <label className="form-label">Amount</label>
                <div className="input-group">
                  <span className="input-group-text">$</span>
                  <input
                    type="number"
                    className="form-control"
                    placeholder="Enter amount"
                    value={depositAmount}
                    onChange={(e) => setDepositAmount(e.target.value)}
                  />
                </div>
              </div>
              <button
                className="btn w-100"
                style={{ backgroundColor: brandColor, color: "white" }}
                onClick={handleDeposit}
              >
                Process Deposit
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Status Change Modal */}
      {showStatusModal && (
        <Modal
          isOpen={showStatusModal}
          onClose={() => setShowStatusModal(false)}
          title="Confirm Status Change"
        >
          <p>
            Are you sure you want to{" "}
            {userStatus === "active" ? "suspend" : "activate"} this account?
          </p>
          <div className="d-flex justify-content-end mt-4">
            <button
              className="btn btn-secondary me-2"
              onClick={() => setShowStatusModal(false)}
            >
              Cancel
            </button>
            <button
              className="btn btn-primary"
              style={{ backgroundColor: brandColor, color: "white" }}
              onClick={confirmStatusChange}
            >
              Confirm
            </button>
          </div>
        </Modal>
      )}

      {/* Delete Account Modal */}
      {showDeleteModal && (
        <Modal
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          title="Confirm Account Deletion"
        >
          <p>
            Are you sure you want to delete the account for{" "}
            <strong>{selectedUser?.name}</strong>? This action cannot be undone.
          </p>
          <div className="d-flex justify-content-end mt-4">
            <button
              className="btn btn-secondary me-2"
              onClick={() => setShowDeleteModal(false)}
            >
              Cancel
            </button>
            <button
              className="btn btn-danger"
              onClick={confirmDeleteAccount}
            >
              Delete
            </button>
          </div>
        </Modal>
      )}

      {/* Personal Information Section */}
      <div className="card shadow-sm mt-4">
        <div className="card-header" style={{ backgroundColor: brandColor, color: "white" }}>
          <h5 className="card-title mb-0">Personal Information</h5>
        </div>
        <div className="card-body">
          <div className="row g-4">
          <div className="col-md-6">
            <h6>Basic Details</h6>
            <p>
              <strong>Name:</strong> {personalInfo.name}
            </p>
            <p>
              <strong>Email:</strong> {personalInfo.email}
            </p>
            <p>
              <strong>Phone:</strong> {personalInfo.phone}
            </p>
          </div>
          <div className="col-md-6">
            <h6>Address</h6>
            <p>{personalInfo.address}</p>
          </div>
          </div>
          <div className="row g-4 mt-3">
          <div className="col-md-6">
            <h6>ID Card (Front)</h6>
            <img
              src={personalInfo.idCardFront}
              alt="ID Card Front"
              className="img-fluid rounded"
            />
          </div>
          <div className="col-md-6">
            <h6>ID Card (Back)</h6>
            <img
              src={personalInfo.idCardBack}
              alt="ID Card Back"
              className="img-fluid rounded"
            />
          </div>
          </div>
        </div>
      </div>

      {/* Activity Log Section */}
      <div className="card mb-4 mt-4">
        <div className="card-header d-flex justify-content-between align-items-center">
          <h5 className="mb-0">Activity Log</h5>
          <div>
            <button
              className="btn me-2"
              style={{ backgroundColor: brandColor, color: "white" }}
              data-bs-toggle="collapse"
              data-bs-target="#activityLogInputForm"
              aria-expanded="false"
              aria-controls="activityLogInputForm"
            >
              <i className="fas fa-plus me-1"></i> Add Entry
            </button>
          </div>
        </div>
        <div className="collapse" id="activityLogInputForm">
          <div className="card-body">
            <form>
              <div className="row g-3">
                <div className="col-md-4">
                  <label htmlFor="activityDate" className="form-label">Date</label>
                  <input type="date" className="form-control" id="activityDate" />
                </div>
                <div className="col-md-4">
                  <label htmlFor="activityRecipient" className="form-label">Recipient</label>
                  <input type="text" className="form-control" id="activityRecipient" placeholder="Enter recipient name" />
                </div>
                <div className="col-md-4">
                  <label htmlFor="activityBank" className="form-label">Bank</label>
                  <input type="text" className="form-control" id="activityBank" placeholder="Enter bank name" />
                </div>
                <div className="col-md-4">
                  <label htmlFor="activityAmount" className="form-label">Amount</label>
                  <input type="number" className="form-control" id="activityAmount" placeholder="Enter amount" />
                </div>
                <div className="col-md-4">
                  <label htmlFor="activityCurrency" className="form-label">Currency</label>
                  <select className="form-select" id="activityCurrency">
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                    <option value="GBP">GBP</option>
                    <option value="JPY">JPY</option>
                  </select>
                </div>
                <div className="col-md-4">
                  <label htmlFor="activityStatus" className="form-label">Status</label>
                  <select className="form-select" id="activityStatus">
                    <option value="Completed">Completed</option>
                    <option value="Pending">Pending</option>
                    <option value="Failed">Failed</option>
                  </select>
                </div>
              </div>
              <div className="d-flex justify-content-end mt-3">
                <button type="submit" className="btn "
                style={{ backgroundColor: brandColor, color: "white" }}
                >Add Entry</button>
              </div>
            </form>
          </div>
        </div>
        <div className="table-responsive">
          <TransactionHistoryTable showPagination={false} />
        </div>
      </div>

      {/* Loan Management Section */}
      <div className="card mb-4">
        <div className="card-header d-flex justify-content-between align-items-center">
          <h5 className="mb-0">Loan Management</h5>
          <div>
            <button
              className="btn me-2"
              style={{ backgroundColor: brandColor, color: "white" }}
              data-bs-toggle="modal"
              data-bs-target="#addLoanModal"
            >
              <i className="fas fa-plus me-1"></i> Add Loan
            </button>
          </div>
        </div>
        <div className="table-responsive">
          <LoanHistoryTable />
        </div>
      </div>

      {/* Add Loan Modal */}
      <div
        className="modal fade"
        id="addLoanModal"
        tabIndex="-1"
        aria-labelledby="addLoanModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="addLoanModalLabel">
                Add Loan
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <form id="addLoanForm">
                <div className="mb-3">
                  <label htmlFor="loanId" className="form-label">
                    Loan ID
                  </label>
                  <input type="text" className="form-control" id="loanId" />
                </div>
                <div className="mb-3">
                  <label htmlFor="loanAmount" className="form-label">
                    Amount
                  </label>
                  <input type="number" className="form-control" id="loanAmount" />
                </div>
                <div className="mb-3">
                  <label htmlFor="loanPurpose" className="form-label">
                    Purpose
                  </label>
                  <input type="text" className="form-control" id="loanPurpose" />
                </div>
                <div className="mb-3">
                  <label htmlFor="loanTerm" className="form-label">
                    Term
                  </label>
                  <input type="text" className="form-control" id="loanTerm" />
                </div>
                <div className="mb-3">
                  <label htmlFor="loanStatus" className="form-label">
                    Status
                  </label>
                  <select className="form-select" id="loanStatus">
                    <option value="Approved">Approved</option>
                    <option value="Pending">Pending</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </div>
                <div className="mb-3">
                  <label htmlFor="disbursedDate" className="form-label">
                    Disbursed Date
                  </label>
                  <input type="date" className="form-control" id="disbursedDate" />
                </div>
                <div className="mb-3">
                  <label htmlFor="repaymentDue" className="form-label">
                    Repayment Due
                  </label>
                  <input type="date" className="form-control" id="repaymentDue" />
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn"
                style={{ backgroundColor: brandColor, color: "white" }}
              >
                Add Loan
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Form Submissions Section */}
      <div className="card mb-4 mt-4">
        <div
          className="card-header"
          style={{ backgroundColor: brandColor, color: "white" }}
        >
          <h5 className="mb-0">Contact Form Submissions</h5>
        </div>
        <div className="card-body">
          {loading ? (
            <p>Loading submissions...</p>
          ) : error ? (
            <p className="text-danger">{error}</p>
          ) : contactSubmissions.length > 0 ? (
            <div className="table-responsive">
              <table className="table table-hover align-middle">
                <thead className="table-light">
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Subject</th>
                    <th>Message</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {contactSubmissions.map((submission) => (
                    <tr key={submission.id}>
                      <td>{submission.id}</td>
                      <td>{submission.name}</td>
                      <td>{submission.email}</td>
                      <td>{submission.phone}</td>
                      <td>{submission.subject}</td>
                      <td>{submission.message}</td>
                      <td>{submission.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-center">No submissions found.</p>
          )}
        </div>
      </div>
    </div>
  );
}