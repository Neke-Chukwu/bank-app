import React, { useState } from "react";
import Modal from "../Components/Modal";

const InvestmentPage = () => {
  const [isTransferModalOpen, setTransferModalOpen] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [transferAmount, setTransferAmount] = useState("");

  const checkingBalance = 5000.0; // Example checking balance


  // Define all investment types
  const investmentAccounts = [
    {
      id: 1,
      type: "Mutual Fund",
      number: "****5678",
      balance: 10000.0,
    },
    {
      id: 2,
      type: "Stocks",
      number: "****1234",
      balance: 15000.0,
    },
    {
      id: 3,
      type: "Investment Account",
      number: "****7890",
      balance: 25000.0, // This should equal the sum of all investment types
    },
  ];

  // Calculate total investments from all funds
  const totalInvestments = investmentAccounts
    .filter((account) => account.type !== "Investment Account")
    .reduce((sum, account) => sum + account.balance, 0);

  // Ensure the investment account balance matches the total investments
  const mainInvestmentAccount = investmentAccounts.find(
    (account) => account.type === "Investment Account"
  );
  if (mainInvestmentAccount) {
    mainInvestmentAccount.balance = totalInvestments;
  }

  const handleTransferClick = (account) => {
    setSelectedAccount(account);
    setTransferAmount("");
    setTransferModalOpen(true);
  };

  const handleTransferSubmit = (e) => {
    e.preventDefault();
    console.log(`Transferred $${transferAmount} to ${selectedAccount.type}`);
    setTransferModalOpen(false);
  };

  return (
    <div className="container py-4">
      {/* Total Investment Overview */}
      <h2 className="mb-4" style={{ color: "#1A3D8F" }}>Your Investment Overview</h2>
      <div className="mb-4 p-3 rounded shadow-sm" style={{ backgroundColor: "#f8f9fa" }}>
        <h5 className="mb-2" style={{ color: "#1A3D8F" }}>Total Investment Balance</h5>
        <p className="h4 fw-bold" style={{ color: "#1A3D8F" }}>
          ${totalInvestments.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </p>
      </div>

      {/* Investment Breakdown */}
      <h4 className="mb-3" style={{ color: "#1A3D8F" }}>Investment Breakdown</h4>
      <div className="row">
        {investmentAccounts
          .filter((account) => account.type !== "Investment Account")
          .map((account) => (
            <div key={account.id} className="col-md-6 mb-4">
              <div
                className="card p-3 shadow-sm border-0 account-card"
                style={{
                  borderRadius: "10px",
                  backgroundColor: "#1A3D8F",
                  color: "white",
                }}
              >
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <h5 className="h6 fw-bold">{account.type}</h5>
                  <small>{account.number}</small>
                </div>
                <p className="h5 fw-bold">
                  $
                  {account.balance.toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </p>
                <div className="d-flex gap-2 mt-3">
                  <button
                    className="btn btn-outline-light btn-sm rounded-pill"
                    onClick={() => handleTransferClick(account)}
                  >
                    Add Funds
                  </button>
                  <button className="btn btn-outline-light btn-sm rounded-pill">
                    Details
                  </button>
                </div>
              </div>
            </div>
          ))}
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

      {/* Modal for Adding Funds */}
      <Modal
        isOpen={isTransferModalOpen}
        onClose={() => setTransferModalOpen(false)}
        title={`Transfer to ${selectedAccount?.type}`}
      >
        <form onSubmit={handleTransferSubmit}>
          <div className="mb-3">
            <label className="form-label" style={{ color: "#1A3D8F" }}>
              Amount to Transfer
            </label>
            <input
              type="number"
              className="form-control"
              placeholder="e.g. 200.00"
              value={transferAmount}
              onChange={(e) => setTransferAmount(e.target.value)}
              min="0"
              max={checkingBalance}
              step="0.01"
              required
            />
            <div className="form-text" style={{ color: "#6c757d" }}>
              Available from checking: ${checkingBalance.toFixed(2)}
            </div>
          </div>
          <button
            type="submit"
            className="btn w-100"
            style={{
              backgroundColor: "#1A3D8F",
              color: "white",
              borderRadius: "5px",
            }}
          >
            Transfer Funds
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default InvestmentPage;