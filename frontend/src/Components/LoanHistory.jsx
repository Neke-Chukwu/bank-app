import React, { useEffect, useState } from "react";

const LoanHistoryTable = () => {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLoans = async () => {
      try {
        const token = localStorage.getItem("token"); // Retrieve token from localStorage
        console.log("Token from localStorage:", token); // Debugging: Log the token
  
        const response = await fetch("http://localhost:5000/api/loans/my-loans", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`, // Include the token in the Authorization header
          },
        });
  
        console.log("Response Status:", response.status); // Debugging: Log the response status
  
        if (!response.ok) {
          throw new Error("Failed to fetch loan history");
        }
  
        const data = await response.json();
        console.log("Fetched Loans:", data); // Debugging: Log the fetched loans
        setLoans(data); // Set the fetched loans
      } catch (err) {
        console.error("Error fetching loan history:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
  
    fetchLoans();
  }, []);

  if (loading) {
    return <div>Loading loan history...</div>;
  }

  if (error) {
    return <div className="text-danger">Error: {error}</div>;
  }

  return (
    <div className="table-responsive mt-4">
      <table className="table table-bordered">
        <thead className="table-white text-center">
          <tr>
            <th>Loan ID</th>
            <th>Amount</th>
            <th>Purpose</th>
            <th>Term</th>
            <th>Status</th>
            <th>Disbursed Date</th>
            <th>Repayment Due</th>
          </tr>
        </thead>
        <tbody>
          {loans.length > 0 ? (
            loans.map((loan) => (
              <tr key={loan._id}>
                <td>{loan._id}</td>
                <td>${loan.loanAmount}</td>
                <td>{loan.loanPurpose}</td>
                <td>{loan.loanTerm} months</td>
                <td>{loan.status || "Pending"}</td>
                <td>{new Date(loan.createdAt).toLocaleDateString()}</td>
                <td>
                  {loan.repaymentDue
                    ? new Date(loan.repaymentDue).toLocaleDateString()
                    : "N/A"}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" className="text-center">
                No loan history available
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default LoanHistoryTable;