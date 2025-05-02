import React, { useState } from "react";
import Modal from "../Components/Modal";

const SavingsPage = () => {
  const [isTransferModalOpen, setTransferModalOpen] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [transferAmount, setTransferAmount] = useState("");

  const checkingBalance = 3500.0;

  // Sample recent transactions data
  const recentTransactions = [
    { id: 1, date: "2023-03-01", description: "Transfer to Emergency Fund", amount: 200.0 },
    { id: 2, date: "2023-03-05", description: "Transfer to Vacation Fund", amount: 150.0 },
    { id: 3, date: "2023-03-10", description: "Interest Earned", amount: 50.0 },
  ];

  // Define all savings types
  const savingsAccounts = [
    {
      id: 1,
      type: "Emergency Fund",
      number: "****1234",
      balance: 5000.0,
    },
    {
      id: 2,
      type: "Vacation Fund",
      number: "****9876",
      balance: 2300.0,
    },
    {
      id: 3,
      type: "Savings Account",
      number: "****7890",
      balance: 12750.5, // This should equal the sum of all savings types
    },
  ];

  // Calculate total savings from all funds
  const totalFunds = savingsAccounts
    .filter((account) => account.type !== "Savings Account")
    .reduce((sum, account) => sum + account.balance, 0);

  // Ensure the savings account balance matches the total funds
  const mainSavingsAccount = savingsAccounts.find(
    (account) => account.type === "Savings Account"
  );
  if (mainSavingsAccount) {
    mainSavingsAccount.balance = totalFunds;
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
      {/* Total Savings Overview */}
      <h2 className="mb-4" style={{ color: "#1A3D8F" }}>Your Savings Overview</h2>
      <div className="mb-4 p-3 rounded shadow-sm" style={{ backgroundColor: "#f8f9fa" }}>
        <h5 className="mb-2" style={{ color: "#1A3D8F" }}>Total Savings Balance</h5>
        <p className="h4 fw-bold" style={{ color: "#1A3D8F" }}>
          ${totalFunds.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </p>
      </div>

      {/* Funds Breakdown */}
      <h4 className="mb-3" style={{ color: "#1A3D8F" }}>Funds Breakdown</h4>
      <div className="row">
        {savingsAccounts
          .filter((account) => account.type !== "Savings Account")
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

      {/* Recent Transactions */}
      <div className="mt-5">
        <h4 className="mb-3" style={{ color: "#1A3D8F" }}>Recent Transactions</h4>
        <table className="table table-striped">
          <thead>
            <tr style={{ color: "#1A3D8F" }}>
              <th>Date</th>
              <th>Description</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            {recentTransactions.map((transaction) => (
              <tr key={transaction.id}>
                <td>{transaction.date}</td>
                <td>{transaction.description}</td>
                <td>${transaction.amount.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
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

export default SavingsPage;