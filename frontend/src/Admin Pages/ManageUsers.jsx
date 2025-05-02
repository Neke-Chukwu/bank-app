import React, { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import TransactionHistoryTable from "../Components/TransactionHistoryTable";
import Modal from "../Components/Modal";

export default function ManageUsers() {
  const brandColor = "#1A3D8F";
  const API_BASE_URL = "http://localhost:5000/api/admin";
  const { userId: paramUserId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  // Fallback to extract userId from pathname if useParams fails
  const getUserId = () => {
    if (paramUserId) return paramUserId;
    const pathSegments = location.pathname.split("/");
    return pathSegments[pathSegments.length - 1];
  };

  const userId = getUserId();
  console.log("User ID:", userId);

  // State management
  const [userData, setUserData] = useState({
    name: "John Doe",
    email: "",
    phone: "",
    address: "",
    status: "active",
    idVerified: true,
    idCardFront: "",
    idCardBack: "",
  });
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [lastStatusUpdate, setLastStatusUpdate] = useState("");
  const [selectedAccount, setSelectedAccount] = useState("checking");
  const [depositAmount, setDepositAmount] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Replace with your actual auth token retrieval logic
  const getAuthToken = () => {
    return localStorage.getItem("token") || "";
  };

  // Generic API request handler
  const makeApiRequest = async (url, method, data = null) => {
    try {
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getAuthToken()}`,
      };

      const response = await fetch(url, {
        method,
        headers,
        body: data ? JSON.stringify(data) : null,
      });

      console.log("Raw API Response:", { status: response.status, ok: response.ok }); // Debug raw response
      const responseData = await response.json();
      console.log("Parsed API Response:", responseData);
      if (!response.ok) {
        throw new Error(responseData.message || `Request failed with status ${response.status}`);
      }
      return responseData;
    } catch (error) {
      console.error("API Request Error:", error);
      throw error;
    }
  };

  // Fetch user data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch user data
        const userResponse = await makeApiRequest(
          `${API_BASE_URL}/users/${userId}`,
          "GET"
        );
        console.log("Raw User Data:", userResponse.data || userResponse); // Debug raw data
        // Handle cases where response might not have 'data' property
        const userDataRaw = userResponse.data || userResponse;
        if (!userDataRaw || typeof userDataRaw !== "object") {
          throw new Error("Invalid user data received from API");
        }
        // Map API response to userData state
        const userDataWithStatus = {
          name: userDataRaw.username || "Unknown",
          email: userDataRaw.email || "",
          phone: userDataRaw.phoneNumber || "",
          address: userDataRaw.address || "",
          status: userDataRaw.status || "active",
          idVerified: !!userDataRaw.idDocument,
          idCardFront: userDataRaw.idDocument?.frontUrl || "",
          idCardBack: userDataRaw.idDocument?.backUrl || "",
        };
        setUserData(userDataWithStatus);
        console.log("Updated userData:", userDataWithStatus); // Debug state update
      } catch (err) {
        setError(`Failed to fetch user data: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchData();
    } else {
      setError("No user ID provided");
      setLoading(false);
    }
  }, [userId]);

  // Handle deposit
  const handleDeposit = async () => {
    if (!depositAmount || parseFloat(depositAmount) <= 0) {
      alert("Please enter a valid deposit amount.");
      return;
    }

    try {
      const response = await makeApiRequest(
        `${API_BASE_URL}/users/${userId}/accounts/fund`,
        "PUT",
        {
          accountName:
            selectedAccount === "checking"
              ? "Checking Account"
              : selectedAccount === "savings"
              ? "Savings Account"
              : "Investment Account",
          amount: parseFloat(depositAmount),
        }
      );

      alert(response.message);
      setDepositAmount("");
      // Refresh user data
      const userResponse = await makeApiRequest(
        `${API_BASE_URL}/users/${userId}`,
        "GET"
      );
      const userDataRaw = userResponse.data || userResponse;
      if (!userDataRaw || typeof userDataRaw !== "object") {
        throw new Error("Invalid user data received from API");
      }
      setUserData({
        name: userDataRaw.username || "Unknown",
        email: userDataRaw.email || "",
        phone: userDataRaw.phoneNumber || "",
        address: userDataRaw.address || "",
        status: userDataRaw.status || "active",
        idVerified: !!userDataRaw.idDocument,
        idCardFront: userDataRaw.idDocument?.frontUrl || "",
        idCardBack: userDataRaw.idDocument?.backUrl || "",
      });
    } catch (error) {
      alert(`Deposit failed: ${error.message}`);
    }
  };

  // Handle status change
  const handleStatusToggle = () => {
    setShowStatusModal(true);
  };

  const confirmStatusChange = async () => {
    try {
      const newStatus = userData.status === "active" ? "suspended" : "active";

      await makeApiRequest(
        `${API_BASE_URL}/users/suspend/${userId}`,
        "PUT",
        { status: newStatus }
      );

      setUserData({ ...userData, status: newStatus });
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
    } catch (error) {
      alert(`Status change failed: ${error.message}`);
    }
  };

  // Handle delete account
  const handleDeleteAccount = () => {
    setShowDeleteModal(true);
  };

  const confirmDeleteAccount = async () => {
    try {
      await makeApiRequest(
        `${API_BASE_URL}/users/${userId}`,
        "DELETE"
      );

      alert(`User account for ${userData.name} deleted`);
      setShowDeleteModal(false);
      navigate("/admin/users");
    } catch (error) {
      alert(`Deletion failed: ${error.message}`);
    }
  };

  return (
    <div className="container py-5">
      {/* Header */}
      <header className="mb-4">
        <h1 className="text-primary">Admin Dashboard</h1>
      </header>

      {loading ? (
        <p>Loading user data...</p>
      ) : error ? (
        <p className="text-danger">{error}</p>
      ) : !userData || !userData.status ? (
        <p className="text-danger">Invalid user data</p>
      ) : (
        <>
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
                      userData.status === "active" ? "bg-success" : "bg-danger"
                    }`}
                  >
                    {userData.status.toUpperCase()}
                  </span>
                  <button
                    className={`btn mt-3 w-100 ${
                      userData.status === "active" ? "btn-danger" : "btn-success"
                    }`}
                    onClick={handleStatusToggle}
                  >
                    {userData.status === "active" ? "Suspend Account" : "Activate Account"}
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
                {userData.status === "active" ? "suspend" : "activate"} this account?
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
                <strong>{userData.name}</strong>? This action cannot be undone.
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
                  <p><strong>Name:</strong> {userData.name}</p>
                  <p><strong>Email:</strong> {userData.email}</p>
                  <p><strong>Phone:</strong> {userData.phone || "Not provided"}</p>
                </div>
                <div className="col-md-6">
                  <h6>Address</h6>
                  <p>{userData.address || "Not provided"}</p>
                </div>
              </div>
              <div className="row g-4 mt-3">
                <div className="col-md-6">
                  <h6>ID Card (Front)</h6>
                  {userData.idCardFront ? (
                    <img
                      src={userData.idCardFront}
                      alt="ID Card Front"
                      className="img-fluid rounded"
                    />
                  ) : (
                    <p>No image provided</p>
                  )}
                </div>
                <div className="col-md-6">
                  <h6>ID Card (Back)</h6>
                  {userData.idCardBack ? (
                    <img
                      src={userData.idCardBack}
                      alt="ID Card Back"
                      className="img-fluid rounded"
                    />
                  ) : (
                    <p>No image provided</p>
                  )}
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
                <form onSubmit={async (e) => {
                  e.preventDefault();
                  const formData = new FormData(e.target);
                  try {
                    await makeApiRequest(
                      `${API_BASE_URL}/activity-log`,
                      "POST",
                      {
                        date: formData.get("activityDate"),
                        recipient: formData.get("activityRecipient"),
                        bank: formData.get("activityBank"),
                        amount: parseFloat(formData.get("activityAmount")),
                        currency: formData.get("activityCurrency"),
                        status: formData.get("activityStatus"),
                      }
                    );
                    alert("Activity log entry added");
                    e.target.reset();
                  } catch (error) {
                    alert(`Failed to add entry: ${error.message}`);
                  }
                }}>
                  <div className="row g-3">
                    <div className="col-md-4">
                      <label htmlFor="activityDate" className="form-label">Date</label>
                      <input type="date" className="form-control" id="activityDate" name="activityDate" />
                    </div>
                    <div className="col-md-4">
                      <label htmlFor="activityRecipient" className="form-label">Recipient</label>
                      <input type="text" className="form-control" id="activityRecipient" name="activityRecipient" placeholder="Enter recipient name" />
                    </div>
                    <div className="col-md-4">
                      <label htmlFor="activityBank" className="form-label">Bank</label>
                      <input type="text" className="form-control" id="activityBank" name="activityBank" placeholder="Enter bank name" />
                    </div>
                    <div className="col-md-4">
                      <label htmlFor="activityAmount" className="form-label">Amount</label>
                      <input type="number" className="form-control" id="activityAmount" name="activityAmount" placeholder="Enter amount" />
                    </div>
                    <div className="col-md-4">
                      <label htmlFor="activityCurrency" className="form-label">Currency</label>
                      <select className="form-select" id="activityCurrency" name="activityCurrency">
                        <option value="USD">USD</option>
                        <option value="EUR">EUR</option>
                        <option value="GBP">GBP</option>
                        <option value="JPY">JPY</option>
                      </select>
                    </div>
                    <div className="col-md-4">
                      <label htmlFor="activityStatus" className="form-label">Status</label>
                      <select className="form-select" id="activityStatus" name="activityStatus">
                        <option value="Completed">Completed</option>
                        <option value="Pending">Pending</option>
                        <option value="Failed">Failed</option>
                      </select>
                    </div>
                  </div>
                  <div className="d-flex justify-content-end mt-3">
                    <button
                      type="submit"
                      className="btn"
                      style={{ backgroundColor: brandColor, color: "white" }}
                    >
                      Add Entry
                    </button>
                  </div>
                </form>
              </div>
            </div>
            <div className="table-responsive">
              <TransactionHistoryTable showPagination={false} />
            </div>
          </div>
        </>
      )}
    </div>
  );
}