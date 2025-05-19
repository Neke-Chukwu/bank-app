import React, { useState } from "react";

const LoanApplicationForm = () => {
  const [formData, setFormData] = useState({
    loanAmount: "",
    loanPurpose: "",
    loanTerm: "",
    income: "",
    employmentStatus: "",
    creditScore: "",
    additionalNotes: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validate = () => {
    let newErrors = {};
    if (!formData.loanAmount) newErrors.loanAmount = "Loan amount is required";
    if (!formData.loanPurpose) newErrors.loanPurpose = "Purpose is required";
    if (!formData.loanTerm) newErrors.loanTerm = "Term is required";
    if (!formData.income) newErrors.income = "Income is required";
    if (!formData.employmentStatus) newErrors.employmentStatus = "Employment status is required";
    if (!formData.creditScore) newErrors.creditScore = "Credit score is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        console.log("Token from localStorage:", token); // Debugging: Log the token
  
        const response = await fetch("http://localhost:5000/api/loans", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Include the token in the Authorization header
          },
          body: JSON.stringify(formData),
        });
  
        console.log("Response Status:", response.status); // Debugging: Log the response status
        const data = await response.json();
        console.log("Response Data:", data); // Debugging: Log the response data
  
        if (response.ok) {
          alert("Loan application submitted successfully!");
          setFormData({
            loanAmount: "",
            loanPurpose: "",
            loanTerm: "",
            income: "",
            employmentStatus: "",
            creditScore: "",
            additionalNotes: "",
          });
        } else {
          alert(data.error || "Failed to submit loan application");
        }
      } catch (error) {
        console.error("Error submitting loan application:", error);
        alert("An error occurred. Please try again later.");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-3">
        <label className="form-label" style={{ color: "#1A3D8F" }}>
          Loan Amount ($)
        </label>
        <input
          type="number"
          className={`form-control ${errors.loanAmount ? "is-invalid" : ""}`}
          name="loanAmount"
          value={formData.loanAmount}
          onChange={handleChange}
          placeholder="Enter the total amount you wish to borrow"
        />
        {errors.loanAmount && <div className="invalid-feedback">{errors.loanAmount}</div>}
      </div>

      <div className="mb-3">
        <label className="form-label" style={{ color: "#1A3D8F" }}>
          Purpose of Loan
        </label>
        <select
          className={`form-select ${errors.loanPurpose ? "is-invalid" : ""}`}
          name="loanPurpose"
          value={formData.loanPurpose}
          onChange={handleChange}
        >
          <option value="">Select</option>
          <option value="personal">Personal</option>
          <option value="home">Home</option>
          <option value="auto">Auto</option>
          <option value="education">Education</option>
        </select>
        {errors.loanPurpose && <div className="invalid-feedback">{errors.loanPurpose}</div>}
      </div>

      <div className="mb-3">
        <label className="form-label" style={{ color: "#1A3D8F" }}>
          Loan Term (in months)
        </label>
        <input
          type="number"
          className={`form-control ${errors.loanTerm ? "is-invalid" : ""}`}
          name="loanTerm"
          value={formData.loanTerm}
          onChange={handleChange}
          placeholder="e.g. 12 months, 24 months, etc."
        />
        {errors.loanTerm && <div className="invalid-feedback">{errors.loanTerm}</div>}
      </div>

      <div className="mb-3">
        <label className="form-label" style={{ color: "#1A3D8F" }}>
          Annual Income ($)
        </label>
        <input
          type="number"
          className={`form-control ${errors.income ? "is-invalid" : ""}`}
          name="income"
          value={formData.income}
          onChange={handleChange}
          placeholder="Enter your annual income"
        />
        {errors.income && <div className="invalid-feedback">{errors.income}</div>}
      </div>

      <div className="mb-3">
        <label className="form-label" style={{ color: "#1A3D8F" }}>
          Employment Status
        </label>
        <select
          className={`form-select ${errors.employmentStatus ? "is-invalid" : ""}`}
          name="employmentStatus"
          value={formData.employmentStatus}
          onChange={handleChange}
        >
          <option value="">Select</option>
          <option value="employed">Employed</option>
          <option value="self-employed">Self-Employed</option>
          <option value="unemployed">Unemployed</option>
          <option value="student">Student</option>
        </select>
        {errors.employmentStatus && <div className="invalid-feedback">{errors.employmentStatus}</div>}
      </div>

      <div className="mb-3">
        <label className="form-label" style={{ color: "#1A3D8F" }}>
          Estimated Credit Score
        </label>
        <input
          type="number"
          className={`form-control ${errors.creditScore ? "is-invalid" : ""}`}
          name="creditScore"
          value={formData.creditScore}
          onChange={handleChange}
          placeholder="Estimate or use your recent credit report"
        />
        {errors.creditScore && <div className="invalid-feedback">{errors.creditScore}</div>}
      </div>

      <div className="mb-3">
        <label className="form-label" style={{ color: "#1A3D8F" }}>
          Additional Notes (optional)
        </label>
        <textarea
          className="form-control"
          name="additionalNotes"
          value={formData.additionalNotes}
          onChange={handleChange}
          rows={3}
          placeholder="Add any additional information here"
        />
      </div>

      <button
        type="submit"
        className="btn w-100"
        style={{
          backgroundColor: "#1A3D8F",
          color: "white",
          borderRadius: "5px",
        }}
        disabled={loading}
      >
        {loading ? "Submitting..." : "Apply for Loan"}
      </button>
    </form>
  );
};

export default LoanApplicationForm;