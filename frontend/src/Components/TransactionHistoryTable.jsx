import React from "react";

const TransactionHistoryTable = ({
  transactions = [], 
  totalTransactions,
  limit = 10,
  currentPage,
  onPageChange,
  showPagination = true,
}) => {
  //console.log("Transactions received in TransactionHistoryTable:", transactions);

  const totalPages = Math.ceil(totalTransactions / limit);

  return (
    <div className="table-responsive">
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Date/Time</th>
            <th>Recipient</th>
            <th>Bank</th>
            <th>Description</th>
            <th>Amount</th>
            <th>Transaction Type</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction) => (
            <tr key={transaction._id}>
              <td>{new Date(transaction.transferDate).toLocaleDateString()}</td>
              <td>{transaction.recipientName}</td>
              <td>{transaction.recipientBank || "N/A"}</td>
              <td>
                <span
                  className={
                    transaction.transactionType === "credit"
                      ? "text-success"
                      : "text-danger"
                  }
                >
                  {transaction.transactionType === "credit" ? "+" : "-"}
                  {(transaction.amount || 0).toLocaleString("en-US", {
                    style: "currency",
                    currency: transaction.currency || "USD",
                  })}
                </span>
              </td>
              <td>
                <span
                  style={{
                    color:
                      transaction.transactionType === "credit"
                        ? "#007bff" // Blue for credit
                        : "#ff6b6b", // Light red/pink for debit
                    fontWeight: "bold",
                  }}
                >
                  {transaction.transactionType.charAt(0).toUpperCase() +
                    transaction.transactionType.slice(1) || "N/A"}
                </span>
              </td>
              <td>
                <span
                  className={`badge ${
                    transaction.status === "Completed"
                      ? "bg-success"
                      : "bg-warning text-dark"
                  }`}
                >
                  {transaction.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showPagination && totalPages > 1 && (
        <div className="d-flex justify-content-center mt-4">
          <nav>
            <ul className="pagination">
              <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                <button
                  className="page-link"
                  onClick={() => onPageChange(currentPage - 1)}
                >
                  Previous
                </button>
              </li>
              {Array.from({ length: totalPages }, (_, index) => (
                <li
                  key={index + 1}
                  className={`page-item ${
                    currentPage === index + 1 ? "active" : ""
                  }`}
                >
                  <button
                    className="page-link"
                    onClick={() => onPageChange(index + 1)}
                  >
                    {index + 1}
                  </button>
                </li>
              ))}
              <li
                className={`page-item ${
                  currentPage === totalPages ? "disabled" : ""
                }`}
              >
                <button
                  className="page-link"
                  onClick={() => onPageChange(currentPage + 1)}
                >
                  Next
                </button>
              </li>
            </ul>
          </nav>
        </div>
      )}
    </div>
  );
};

export default TransactionHistoryTable;