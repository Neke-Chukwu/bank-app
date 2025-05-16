import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const brandColor = "#1A3D8F";

  const handleGoBack = () => {
    if (location.key !== "default") {
      // Navigate to the last valid page if there is a history
      navigate(-1);
    } else {
      // If no history exists, navigate to the home page
      navigate("/");
    }
  };

  return (
    <div
      className="d-flex flex-column justify-content-center align-items-center vh-100"
      style={{ backgroundColor: "#f8f9fa", color: brandColor }}
    >
      <h1 style={{ fontSize: "6rem", fontWeight: "bold", color: brandColor }}>
        404
      </h1>
      <h2 className="mb-4" style={{ color: "#6c757d" }}>
        Oops! The page you're looking for doesn't exist.
      </h2>
      <div className="d-flex gap-3">
        <button
          onClick={handleGoBack}
          className="btn btn-lg"
          style={{
            backgroundColor: brandColor,
            color: "#fff",
            borderRadius: "5px",
            padding: "10px 20px",
          }}
        >
          Go Back
        </button>
        <a
          href="/"
          className="btn btn-lg"
          style={{
            backgroundColor: "#6c757d",
            color: "#fff",
            borderRadius: "5px",
            padding: "10px 20px",
          }}
        >
          Go to Home
        </a>
      </div>
    </div>
  );
};

export default NotFound;