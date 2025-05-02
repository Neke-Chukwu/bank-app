import React, { useState, useEffect } from "react";
import Modal from "../Components/Modal";
import LocalTransferForm from "../Forms/LocalTransferForm";

const LocalTransferPage = () => {
  const [showTransferForm, setShowTransferForm] = useState(false);
  const [userAccounts, setUserAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserAccounts = async () => {
      try {
        const token = localStorage.getItem("token"); // Retrieve the token from local storage
        if (!token) {
          throw new Error("No token found. Please log in again.");
        }
  
        const response = await fetch("http://localhost:5000/api/users/user", {
          headers: {
            Authorization: `Bearer ${token}`, // Include the token in the Authorization header
          },
        });
  
        if (!response.ok) {
          throw new Error("Failed to fetch user accounts.");
        }
  
        const data = await response.json();
        setUserAccounts(data.user.accounts); // Set the accounts from the response
        setLoading(false);
      } catch (err) {
        console.error("Error fetching user accounts:", err);
        setError(err.message);
        setLoading(false);
      }
    };
  
    fetchUserAccounts();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="container py-5">
      {/* Page Title */}
      <h2 className="mb-4 text-center" style={{ color: "#1A3D8F" }}>
        Local Transfers
      </h2>

      {/* Info Section */}
      <div className="bg-light p-4 rounded shadow-sm mb-4">
        <h5 style={{ color: "#1A3D8F" }}>Transfer Money Within the U.S.</h5>
        <p style={{ color: "#6c757d" }}>
          Use this service to send money between U.S. bank accounts. Funds
          typically arrive same-day or next business day depending on the
          receiving bank.
        </p>
        <ul className="small" style={{ color: "#6c757d" }}>
          <li>✅ No international fees</li>
          <li>✅ Instant routing for domestic banks</li>
          <li>✅ Secure encrypted transfer</li>
        </ul>
      </div>

      {/* Tip Box */}
      <div
        className="alert alert-info"
        style={{
          backgroundColor: "#E9F7FF",
          borderColor: "#1A3D8F",
          color: "#1A3D8F",
        }}
      >
        💡 <strong>Tip:</strong> Make sure you enter the correct routing number
        and account number to avoid failed transfers.
      </div>

      {/* CTA */}
      <div className="text-center my-4">
        <button
          className="btn btn-lg"
          style={{
            backgroundColor: "#1A3D8F",
            color: "white",
            borderRadius: "5px",
          }}
          onClick={() => setShowTransferForm(true)}
        >
          Initiate Local Transfer
        </button>
      </div>

      {/* How it works */}
      <div className="bg-white p-4 rounded shadow-sm mt-5">
        <h5 style={{ color: "#1A3D8F" }}>How Local Transfers Work</h5>
        <ol className="small" style={{ color: "#6c757d" }}>
          <li>Enter the recipient's bank account details.</li>
          <li>Verify your details and authorize the transfer.</li>
          <li>Funds are processed securely and sent within 24 hours.</li>
        </ol>
      </div>

      {/* Modal */}
      <Modal
        isOpen={showTransferForm}
        onClose={() => setShowTransferForm(false)}
        title="Local Bank Transfer"
      >
        <LocalTransferForm
          userAccounts={userAccounts} // Pass the fetched accounts to the form
          onClose={() => setShowTransferForm(false)}
        />
      </Modal>
    </div>
  );
};

export default LocalTransferPage;