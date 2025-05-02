import React, { useState, useEffect } from "react";
import TransactionHistoryTable from "../Components/TransactionHistoryTable";

const Transactions = () => {
  const [transactions, setTransactions] = useState([]); // Store all transactions
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const transactionsPerPage = 5;

  // Fetch all transactions when the component loads
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const token = localStorage.getItem("token");
        console.log("Token from localStorage:", token);

        if (!token) {
          throw new Error("No token found. Please log in again.");
        }

        const response = await fetch("http://localhost:5000/api/transfers/transactions", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log("Response status:", response.status);

        if (!response.ok) {
          const errorData = await response.json();
          console.error("Error response from backend:", errorData);
          throw new Error(errorData.message || "Failed to fetch transactions.");
        }

        const data = await response.json();
        console.log("Fetched transactions:", data.transfers);
        setTransactions(data.transfers); // Set the transactions from the response
        setLoading(false);
      } catch (err) {
        console.error("Error fetching transactions:", err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  // Filter transactions based on the search query
  const filteredTransactions = transactions.filter((transaction) =>
    Object.values(transaction)
      .join(" ")
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  // Paginate the filtered transactions
  const indexOfLastTransaction = currentPage * transactionsPerPage;
  const indexOfFirstTransaction = indexOfLastTransaction - transactionsPerPage;
  const currentTransactions = filteredTransactions.slice(
    indexOfFirstTransaction,
    indexOfLastTransaction
  );

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Add a console.log here to debug filtered transactions
  console.log("Filtered transactions:", filteredTransactions);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="container py-5">
      <h2 className="text-center mb-4" style={{ color: "#1A3D8F" }}>
        Transaction History
      </h2>

      {/* Intro Section */}
      <div className="bg-light p-4 rounded shadow-sm mb-4">
        <p className="mb-0 text-muted">
          View and manage all your transactions in one place. Use the search bar to find specific
          transactions or navigate through pages to explore your transaction history.
        </p>
      </div>

      {/* Search Bar */}
      <div className="mb-4">
        <div className="input-group" style={{ maxWidth: "400px", margin: "0 auto" }}>
          <span className="input-group-text">
            <i className="fas fa-search"></i>
          </span>
          <input
            type="text"
            className="form-control"
            placeholder="Search transactions"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1); // Reset to the first page when searching
            }}
          />
        </div>
      </div>

      {/* Transactions Table */}
      <TransactionHistoryTable
        transactions={currentTransactions} // Pass filtered transactions
        totalTransactions={filteredTransactions.length}
        limit={transactionsPerPage}
        currentPage={currentPage}
        onPageChange={handlePageChange}
        showPagination={true}
      />
    </div>
  );
};

export default Transactions;