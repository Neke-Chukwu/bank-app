import React from "react";

const TransactionHistoryTable = ({
  transactions = [],
  totalTransactions,
  limit = 10,
  currentPage,
  onPageChange,
  showPagination = true,
}) => {
  const totalPages = Math.ceil(totalTransactions / limit);

  const truncateDescription = (text) => {
    if (!text) return "N/A";
    const words = text.split(/\s+/);
    if (words.length <= 10) return text;
    return words.slice(0, 10).join(" ") + "...";
  };

  // Helper to detect small screen in JS (optional, for rendering)
  // But better done with CSS for layout only.
  // Instead, we’ll use CSS to show/hide headers

  return (
    <>
      <style>{`
        /* Scroll container on mobile */
        @media (max-width: 767.98px) {
          .mobile-scroll-table-container {
            overflow-x: auto;
            -webkit-overflow-scrolling: touch;
          }
          .mobile-scroll-table {
            min-width: 700px;
          }
          /* Show only "Date" header on mobile, hide "Date/Time" header */
          .header-date-time {
            display: none;
          }
          .header-date-only {
            display: table-cell;
          }
        }

        @media (min-width: 768px) {
          .mobile-scroll-table-container {
            overflow-x: visible !important;
          }
          .mobile-scroll-table {
            min-width: auto !important;
          }
          /* Show full Date/Time header on desktop */
          .header-date-time {
            display: table-cell;
          }
          .header-date-only {
            display: none;
          }
        }
      `}</style>

      <div className="table-responsive mobile-scroll-table-container">
        <table className="table table-striped mobile-scroll-table">
          <thead>
            <tr>
              {/* Full Date/Time header for desktop */}
              <th className="header-date-time">Date/Time</th>
              {/* Date-only header for mobile */}
              <th className="header-date-only">Date</th>

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
              transactions.map((transaction) => {
                const date = new Date(transaction.transferDate);
                return (
                  <tr key={transaction._id}>
                    {/* Show Date/Time on desktop */}
                    <td className="header-date-time">
                      {date.toLocaleString("en-US", {
                        year: "numeric",
                        month: "numeric",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true,
                      })}
                    </td>

                    {/* Show Date only on mobile */}
                    <td className="header-date-only">
                      {date.toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "numeric",
                        day: "numeric",
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
                              ? "#007bff"
                              : "#ff6b6b",
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
      transaction.status === "Approved" || transaction.status === "Completed"
        ? "bg-success"
        : "bg-warning text-dark"
    }`}
  >
    {transaction.status === "Approved"
      ? "Completed"
      : transaction.status || "N/A"}
  </span>
</td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="8" className="text-center">
                  No transactions found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

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
    </>
  );
};

export default TransactionHistoryTable;
