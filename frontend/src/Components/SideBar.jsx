import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const toggleSidebar = () => setIsOpen(!isOpen);
  const closeSidebar = () => setIsOpen(false);

  const navCategories = [
    {
      header: "Main",
      links: [
        { path: "/user/dashboard", label: "Dashboard", icon: "fas fa-home" },
        { path: "/user/transactions", label: "Transactions", icon: "fas fa-clock-rotate-left" },
        { path: "/user/deposit", label: "Deposit", icon: "fas fa-plus" },
        { path: "/user/cards", label: "Cards", icon: "fas fa-credit-card" },
      ],
    },
    {
      header: "Transfers",
      links: [
        { path: "/user/local-transfer", label: "Local Transfers", icon: "fas fa-money-bill-transfer" },
        { path: "/user/international-transfer", label: "International Transfers", icon: "fas fa-globe" },
      ],
    },
    {
      header: "Services",
      links: [
        { path: "/user/pay-bills", label: "Bill Payment", icon: "fas fa-receipt" },
        { path: "/user/loans", label: "Loan", icon: "fas fa-coins" },
        { path: "/user/savings", label: "Savings", icon: "fas fa-piggy-bank" },
        { path: "/user/investments", label: "Investments", icon: "fas fa-seedling" },
      ],
    },
  ];

  return (
    <>
      {/* Hamburger for small screens */}
      <button
        className="btn d-lg-none m-2 position-fixed fw-bolder fs-5"
        onClick={toggleSidebar}
        style={{
          zIndex: 1050,
          backgroundColor: "#1A3D8F",
          color: "white",
          borderRadius: "30%",
          width: "50px",
          height: "50px",
        }}
      >
        ☰
      </button>

      {/* Sidebar for large screens */}
      <div
        className="sidebar text-primary p-3 d-none d-lg-block"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "250px",
          backgroundColor: "white", // Background color changed to white
          height: "100vh",
          overflowY: "auto",
          zIndex: 1040,
          boxShadow: "2px 0 5px rgba(0, 0, 0, 0.1)",
        }}
      >
        {/* SecureBank Logo */}
        <div className="d-flex align-items-center mb-4">
          <i className="fas fa-landmark me-2" style={{ color: "#1A3D8F", fontSize: "1.5rem" }}></i>
          <span className="fw-bold" style={{ color: "#1A3D8F", fontSize: "1.2rem" }}>Neon Trust Bank</span>
        </div>

        {navCategories.map((category, index) => (
          <div key={index} className="mb-4">
            <h6 className="text-uppercase text-muted fw-bold mb-2" style={{ fontSize: "0.85rem", color: "Black" }}>
              {category.header}
            </h6>
            <ul className="nav flex-column">
              {category.links.map((link) => (
                <li className="nav-item mb-2" key={link.path}>
                  <Link
                    to={link.path}
                    onClick={closeSidebar}
                    className={`sidebar-link d-flex align-items-center ${
                      location.pathname === link.path ? "active-link" : ""
                    }`}
                    style={{
                      color: "#1A3D8F",
                      textDecoration: "none",
                      padding: "8px 12px",
                      borderRadius: "4px",
                      transition: "background-color 0.3s ease",
                      backgroundColor: location.pathname === link.path ? "#E8F0FE" : "transparent", // Subtle background for active link
                    }}
                  >
                    <i className={`${link.icon} me-2`} style={{ fontSize: "1rem", color: "#1A3D8F" }}></i>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Sidebar for small screens */}
      {isOpen && (
        <div
          className="sidebar-mobile p-3 d-lg-none"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "250px",
            height: "100vh",
            backgroundColor: "white", 
            color: "#1A3D8F", 
            overflowY: "auto",
            zIndex: 1050,
            boxShadow: "2px 0 5px rgba(0, 0, 0, 0.1)",
          }}
        >
          {/* Close Icon */}
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div className="d-flex align-items-center">
              <i className="fas fa-landmark me-2" style={{ color: "#1A3D8F", fontSize: "1.5rem" }}></i>
              <span className="fw-bold" style={{ color: "#1A3D8F", fontSize: "1rem" }}>Neon Trust Bank</span>
            </div>
            <button
              className="btn btn-close"
              onClick={closeSidebar}
              style={{
                fontSize: "1rem",
                color: "#1A3D8F", // Close icon color changed to #1A3D8F
              }}
            ></button>
          </div>

          {navCategories.map((category, index) => (
            <div key={index} className="mb-4">
              <h6 className="text-uppercase fw-bold mb-2" style={{ fontSize: "0.85rem", color: "#1A3D8F" }}>
                {category.header}
              </h6>
              <ul className="nav flex-column">
                {category.links.map((link) => (
                  <li className="nav-item mb-2" key={link.path}>
                    <Link
                      to={link.path}
                      onClick={closeSidebar}
                      className={`sidebar-link d-flex align-items-center ${
                        location.pathname === link.path ? "active-link" : ""
                      }`}
                      style={{
                        color: "#1A3D8F", // Text color changed to #1A3D8F
                        textDecoration: "none",
                        padding: "8px 12px",
                        borderRadius: "4px",
                        transition: "background-color 0.3s ease",
                        backgroundColor: location.pathname === link.path ? "#E8F0FE" : "transparent", // Subtle background for active link
                      }}
                    >
                      <i className={`${link.icon} me-2`} style={{ fontSize: "1rem", color: "#1A3D8F" }}></i>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      {/* Overlay on mobile */}
      {isOpen && (
        <div
          className="sidebar-overlay d-lg-none"
          onClick={closeSidebar}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            zIndex: 1040,
          }}
        />
      )}

      {/* Disable page scrolling only on small screens when sidebar is open */}
      {isOpen && (
        <style>
          {`
            @media (max-width: 991.98px) {
              body {
                overflow: hidden;
              }
            }
          `}
        </style>
      )}
    </>
  );
};

export default Sidebar;