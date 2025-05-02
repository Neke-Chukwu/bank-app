import React from "react";
import LoanApplicationForm from "../Forms/LoanApplicationForm";
import LoanHistoryTable from "../Components/LoanHistory";

const dummyLoans = [
  {
    id: "LN-001",
    amount: 12000,
    purpose: "Auto",
    term: 36,
    status: "Active",
    disbursedDate: "2024-12-10",
    repaymentDue: "2027-12-10",
  },
  {
    id: "LN-002",
    amount: 5000,
    purpose: "Personal",
    term: 12,
    status: "Repaid",
    disbursedDate: "2023-01-15",
    repaymentDue: "2024-01-15",
  },
];

const LoanPage = () => {
  return (
    <div className="container py-4">
      {/* Page Title */}
      <h2 className="mb-4" style={{ color: "#1A3D8F" }}>Loans</h2>

      {/* Loan Application Section */}
      <section className="mb-5">
        <div className="d-flex align-items-center mb-3">
          <h4 className="me-2" style={{ color: "#1A3D8F" }}>Apply for a New Loan</h4>
        </div>
        <p style={{ color: "#6c757d" }}>
          Use this form to apply for a loan. Ensure your information is accurate.
        </p>
        <LoanApplicationForm />
      </section>

      {/* Loan History Section */}
      <section>
        <div className="d-flex align-items-center mb-3">
          <h4 className="me-2" style={{ color: "#1A3D8F" }}>Loan History</h4>
        </div>
        <p style={{ color: "#6c757d" }}>
          Review your previous and active loan applications below.
        </p>
        <LoanHistoryTable loans={dummyLoans} />
      </section>
    </div>
  );
};

export default LoanPage;