import React, { useState, useEffect } from "react";
import Modal from "../Components/Modal";
import Suspended from "./Suspended";
import InternationalTransferForm from "../Forms/InternationalTransferForm";

const InternationalTransferPage = () => {
  const [showTransferForm, setShowTransferForm] = useState(false);
  const [userAccounts, setUserAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSuspended, setIsSuspended] = useState(false);

  useEffect(() => {
    const fetchUserAccounts = async () => {
      try {
        const token = localStorage.getItem("token"); // Retrieve the token from localStorage
        if (!token) {
          throw new Error("No token found. Please log in again.");
        }

        // Check suspension status
        const userResponse = await fetch("https://api.neontrust.us/api/users/user", {
          headers: {
            Authorization: `Bearer ${token}`, // Include the token in the Authorization header
          },
        });

        if (!userResponse.ok) {
          throw new Error("Failed to fetch user data.");
        }

        const userData = await userResponse.json();
        if (userData.user?.status === false) {
          setIsSuspended(true);
          setLoading(false);
          return;
        }

        // Fetch user accounts
        setUserAccounts(userData.user.accounts); // Set the accounts from the response
        setLoading(false);
      } catch (err) {
        console.error("Error fetching user accounts:", err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchUserAccounts();
  }, []);

  if (isSuspended) {
    return <Suspended />;
  }

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
        International Transfers
      </h2>

      {/* Info Section */}
      <div className="bg-light p-4 rounded shadow-sm mb-4">
        <h5 style={{ color: "#1A3D8F" }}>Send Money Worldwide</h5>
        <p style={{ color: "#6c757d" }}>
          Easily send funds to overseas bank accounts. Our international transfer service supports major currencies with real-time exchange rates.
        </p>
        <ul className="small" style={{ color: "#6c757d" }}>
          <li>🌍 Supported currencies include USD, GBP, EUR, CAD, AUD, and more</li>
          <li>🔒 Transfers are processed securely via SWIFT/IBAN networks</li>
          <li>📩 Notifications are sent when your transfer is complete</li>
        </ul>
      </div>

      {/* Tip Box */}
      <div
        className="alert alert-warning"
        style={{
          backgroundColor: "#FFF4E5",
          borderColor: "#FFC107",
          color: "#856404",
        }}
      >
        ⚠️ <strong>Note:</strong> Double-check the IBAN or SWIFT/BIC codes. Incorrect entries may delay or fail the transfer.
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
          Start International Transfer
        </button>
      </div>

      {/* How it works */}
      <div className="bg-white p-4 rounded shadow-sm mt-5">
        <h5 style={{ color: "#1A3D8F" }}>How International Transfers Work</h5>
        <ol className="small" style={{ color: "#6c757d" }}>
          <li>Choose the recipient’s country and bank.</li>
          <li>Input required details like IBAN, SWIFT, and address.</li>
          <li>Select currency, enter amount, and review fees/exchange rate.</li>
          <li>Authorize payment and track progress from your dashboard.</li>
        </ol>
      </div>

      {/* Modal */}
      <Modal
        isOpen={showTransferForm}
        onClose={() => setShowTransferForm(false)}
        title="International Bank Transfer"
      >
        <InternationalTransferForm
          userAccounts={userAccounts} // Pass user accounts to the form
          onClose={() => setShowTransferForm(false)}
        />
      </Modal>
    </div>
  );
};

export default InternationalTransferPage;