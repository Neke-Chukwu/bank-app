import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Suspended from "./Suspended";

const InvestmentPage = () => {
  const [investmentAccount, setInvestmentAccount] = useState(null);
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
        const userResponse = await axios.get("http://localhost:5000/api/users/user", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (userResponse.data?.user?.status === false) {
          setIsSuspended(true);
          setLoading(false);
          return;
        }

        // Fetch investment account data
        const investmentResponse = await axios.get("http://localhost:5000/api/users/accounts/investment", {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Handle array response: take the first account or set to null
        const accountData = Array.isArray(investmentResponse.data) && investmentResponse.data.length > 0 
          ? investmentResponse.data[0] 
          : null;
        setInvestmentAccount(accountData);
        console.log("Investment account data:", investmentResponse.data);
        console.log("Processed investmentAccount:", accountData);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err.response?.data?.message || "Failed to fetch investment account data.");
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
      <h2 className="mb-4" style={{ color: "#1A3D8F" }}>Your Investment Overview</h2>
      {investmentAccount ? (
        <div className="card p-3 shadow-sm border-0 account-card" style={{ borderRadius: "10px", backgroundColor: "#1A3D8F", color: "white" }}>
          <div className="d-flex justify-content-between align-items-center mb-2">
            <h5 className="h6 fw-bold">{investmentAccount.type || "Investment Account"}</h5>
            <small>{investmentAccount.number || "N/A"}</small>
          </div>
          <p className="h5 fw-bold">
            $
            {(investmentAccount.balance || 0).toLocaleString("en-US", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </p>
        </div>
      ) : (
        <div className="card p-3 shadow-sm border-0">
          <p className="text-muted text-center">No investment account found.</p>
        </div>
      )}
      {/* Investment Tips */}
      <div className="mt-5">
        <h4 className="mb-3" style={{ color: "#1A3D8F" }}>Investment Tips</h4>
        <ul className="list-group">
          <li className="list-group-item">
            <strong>Diversify:</strong> Spread your investments across different asset classes to reduce risk.
          </li>
          <li className="list-group-item">
            <strong>Invest Regularly:</strong> Make consistent contributions to your investment accounts.
          </li>
          <li className="list-group-item">
            <strong>Monitor Performance:</strong> Regularly review your portfolio to ensure it aligns with your goals.
          </li>
          <li className="list-group-item">
            <strong>Stay Informed:</strong> Keep up with market trends and news to make informed decisions.
          </li>
        </ul>
      </div>
    </div>
  );
};

export default InvestmentPage;