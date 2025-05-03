import React, { useState, useEffect } from "react";
import axios from "axios";

const InvestmentPage = () => {
  const [investmentAccount, setInvestmentAccount] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchInvestmentAccount = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:5000/api/accounts/investment", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setInvestmentAccount(response.data);
            } catch (err) {
        console.error(err); // Log the error to the console
        setError("Failed to fetch investment account data.");
      } finally {
        setLoading(false);
      }
    };

    fetchInvestmentAccount();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-danger">{error}</div>;

  return (
    <div className="container py-4">
      <h2 className="mb-4" style={{ color: "#1A3D8F" }}>Your Investment Overview</h2>
      <div className="card p-3 shadow-sm border-0 account-card" style={{ borderRadius: "10px", backgroundColor: "#1A3D8F", color: "white" }}>
        <div className="d-flex justify-content-between align-items-center mb-2">
          <h5 className="h6 fw-bold">{investmentAccount.type}</h5>
          <small>{investmentAccount.number}</small>
        </div>
        <p className="h5 fw-bold">
          $
          {investmentAccount.balance.toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </p>
      </div>
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
