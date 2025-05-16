import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Suspended from "./Suspended";

const SavingsPage = () => {
  const [savingsAccount, setSavingsAccount] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSuspended, setIsSuspended] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        console.error("No token found. Redirecting to login...");
        navigate("/login");
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Check user suspension status
        const userResponse = await axios.get("https://api.neontrust.us/api/users/user", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (userResponse.data?.user?.status === false) {
          setIsSuspended(true);
          setLoading(false);
          return;
        }

        // Fetch savings account data
        const savingsResponse = await axios.get("https://api.neontrust.us/api/users/accounts/savings", {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Handle array response: take the first account or set to null
        const accountData = Array.isArray(savingsResponse.data) && savingsResponse.data.length > 0 
          ? savingsResponse.data[0] 
          : null;
        setSavingsAccount(accountData);
        console.log("Savings account data:", savingsResponse.data);
        console.log("Processed savingsAccount:", accountData);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err.response?.data?.message || "Failed to fetch savings account data.");
        if (err.response?.status === 403) {
          localStorage.removeItem("token");
          navigate("/login");
        }
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
    return (
      <div className="container p-4 text-center">
        <div className="spinner-border" style={{ color: "#1A3D8F" }} role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container p-4 text-center">
        <h4 className="text-danger">{error}</h4>
        <button
          className="btn btn-primary"
          style={{ backgroundColor: "#1A3D8F", borderColor: "#1A3D8F" }}
          onClick={() => window.location.reload()}
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <h2 className="mb-4" style={{ color: "#1A3D8F" }}>Your Savings Overview</h2>
      {savingsAccount ? (
        <div className="card p-3 shadow-sm border-0 account-card" style={{ borderRadius: "10px", backgroundColor: "#1A3D8F", color: "white" }}>
          <div className="d-flex justify-content-between align-items-center mb-2">
            <h5 className="h6 fw-bold">{savingsAccount.type || "Savings Account"}</h5>
            <small>{savingsAccount.number || "N/A"}</small>
          </div>
          <p className="h5 fw-bold">
            $
            {(savingsAccount.balance || 0).toLocaleString("en-US", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </p>
        </div>
      ) : (
        <div className="card p-3 shadow-sm border-0">
          <p className="text-muted text-center">No savings account found.</p>
        </div>
      )}
      {/* Savings Tips */}
      <div className="mt-5">
        <h4 className="mb-3" style={{ color: "#1A3D8F" }}>Savings Tips</h4>
        <ul className="list-group">
          <li className="list-group-item">
            <strong>Set Goals:</strong> Define clear savings goals to stay motivated.
          </li>
          <li className="list-group-item">
            <strong>Automate Savings:</strong> Set up automatic transfers to your savings accounts.
          </li>
          <li className="list-group-item">
            <strong>Track Expenses:</strong> Monitor your spending to identify areas where you can save.
          </li>
          <li className="list-group-item">
            <strong>Build an Emergency Fund:</strong> Save at least 3-6 months' worth of expenses for emergencies.
          </li>
        </ul>
      </div>
    </div>
  );
};

export default SavingsPage;