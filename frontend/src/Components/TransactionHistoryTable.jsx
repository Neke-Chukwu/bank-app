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

  // Function to truncate description to 10 words
  const truncateDescription = (text) => {
    if (!text) return "N/A";
    const words = text.split(/\s+/);
    if (words.length <= 10) return text;
    return words.slice(0, 10).join(" ") + "...";
  };

  return (
    <div className="table-responsive">
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Date/Time</th>
            <th>Sender</th>
            <th>Bank</th>
            <th>Description</th>
            <th>Amount</th>
            <th>Type</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {transactions.length > 0 ? (
            transactions.map((transaction) => (
              <tr key={transaction._id}>
                <td>
                  {new Date(transaction.transferDate).toLocaleString("en-US", {
                    year: "numeric",
                    month: "numeric",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true,
                  })}
                </td>
                <td>{transaction.senderAccount || "N/A"}</td>
                <td>{transaction.recipientBank || "N/A"}</td>
                <td>{truncateDescription(transaction.reference)}</td>
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
                    {transaction.transactionType
                      ? transaction.transactionType.charAt(0).toUpperCase() +
                        transaction.transactionType.slice(1)
                      : "N/A"}
                  </span>
                </td>
                <td>
                  <span
                    className={`badge ${
                      transaction.status === "Approved"
                        ? "bg-success"
                        : "bg-warning text-dark"
                    }`}
                  >
                    {transaction.status || "N/A"}
                  </span>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" className="text-center">
                No transactions found.
              </td>
            </tr>
          )}
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