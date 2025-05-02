import React from "react";

const Suspended = () => {
  const brandColor = "#1A3D8F"; // Your brand color

  return (
    <div
      className="d-flex flex-column justify-content-center align-items-center min-vh-100"
      style={{ backgroundColor: "#f8f9fa" }}
    >
      <div
        className="text-center p-4"
        style={{
          backgroundColor: "white",
          borderRadius: "10px",
          boxShadow: "0 4px 15px rgba(0, 0, 0, 0.2)",
          maxWidth: "500px",
          width: "90%",
        }}
      >
        <h1
          className="fw-bold mb-3"
          style={{ color: brandColor }}
        >
          Account Suspended
        </h1>
        <p className="text-muted mb-4">
          Your account has been suspended. If you believe this is a mistake or
          need assistance, please contact our support team.
        </p>
        <a
          href="mailto:support@neontrust.us"
          className="btn"
          style={{
            backgroundColor: brandColor,
            color: "white",
            padding: "10px 20px",
            borderRadius: "5px",
            textDecoration: "none",
            fontWeight: "bold",
          }}
        >
          Contact Support
        </a>
      </div>
    </div>
  );
};

export default Suspended;