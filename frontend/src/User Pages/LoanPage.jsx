import React from "react";
import LoanApplicationForm from "../Forms/LoanApplicationForm";


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
    </div>
  );
};

export default LoanPage;