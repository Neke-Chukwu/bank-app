import React, { useState, useEffect } from "react";
import axios from "axios";

const SavingsPage = () => {
  const [savingsAccount, setSavingsAccount] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSavingsAccount = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:5000/api/accounts/savings", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSavingsAccount(response.data);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch savings account data.");
      } finally {
        setLoading(false);
      }
    };

    fetchSavingsAccount();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-danger">{error}</div>;

  return (
    <div className="container py-4">
      <h2 className="mb-4" style={{ color: "#1A3D8F" }}>Your Savings Overview</h2>
      <div className="card p-3 shadow-sm border-0 account-card" style={{ borderRadius: "10px", backgroundColor: "#1A3D8F", color: "white" }}>
        <div className="d-flex justify-content-between align-items-center mb-2">
          <h5 className="h6 fw-bold">{savingsAccount.type}</h5>
          <small>{savingsAccount.number}</small>
        </div>
        <p className="h5 fw-bold">
          $
          {savingsAccount.balance.toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </p>
      </div>
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


