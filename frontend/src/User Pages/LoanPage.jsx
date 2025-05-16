import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import LoanApplicationForm from "../Forms/LoanApplicationForm"; // Adjust the import path as necessary
import Suspended from "./Suspended";

const LoansPage = () => {
  const [isSuspended, setIsSuspended] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const checkSuspensionStatus = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Check suspension status
        const userResponse = await axios.get("https://api.neontrust.us/api/users/user", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (userResponse.data?.user?.status === false) {
          setIsSuspended(true);
        }
      } catch (err) {
        console.error("Error checking suspension status:", err);
        setError(err.response?.data?.message || "Failed to check suspension status.");
      } finally {
        setLoading(false);
      }
    };

    checkSuspensionStatus();
  }, [navigate]);

  if (isSuspended) {
    return <Suspended />;
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

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

export default LoansPage;