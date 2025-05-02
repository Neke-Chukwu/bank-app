import React, { useState } from "react";
import Modal from "../Components/Modal";
import PayBillsForm from "../Forms/PayBillsForm";

const BillPaymentPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="container py-5">
      {/* Page Title */}
      <h2 className="text-center mb-4" style={{ color: "#1A3D8F" }}>Bill Payments</h2>

      {/* Introduction Section */}
      <div className="bg-light p-4 rounded shadow-sm mb-5">
        <p className="mb-4" style={{ color: "#6c757d" }}>
          Pay your bills securely and efficiently using Neon Trust Bank. We support payments for utilities, rent, tuition, subscriptions, and more.
        </p>

        <div className="text-center">
          <button
            className="btn btn-lg"
            style={{
              backgroundColor: "#1A3D8F",
              color: "white",
              borderRadius: "5px",
            }}
            onClick={() => setIsModalOpen(true)}
          >
            Pay a Bill
          </button>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="mb-5">
        <h4 className="mb-3" style={{ color: "#1A3D8F" }}>How It Works</h4>
        <ul className="list-group">
          <li className="list-group-item">
            <strong>Step 1:</strong> Select the biller and enter the required details.
          </li>
          <li className="list-group-item">
            <strong>Step 2:</strong> Enter the amount you wish to pay and confirm the payment details.
          </li>
          <li className="list-group-item">
            <strong>Step 3:</strong> Complete the payment securely and receive a confirmation.
          </li>
        </ul>
      </div>

      {/* Popular Bill Categories Section */}
      <div className="mb-5">
        <h4 className="mb-3" style={{ color: "#1A3D8F" }}>Popular Bill Categories</h4>
        <div className="row">
          <div className="col-md-4 mb-3">
            <div
              className="card p-3 shadow-sm border-0"
              style={{
                borderRadius: "10px",
                backgroundColor: "#1A3D8F",
                color: "white",
              }}
            >
              <h5 className="h6 fw-bold">Utilities</h5>
              <p>Electricity, water, and gas bills.</p>
            </div>
          </div>
          <div className="col-md-4 mb-3">
            <div
              className="card p-3 shadow-sm border-0"
              style={{
                borderRadius: "10px",
                backgroundColor: "#1A3D8F",
                color: "white",
              }}
            >
              <h5 className="h6 fw-bold">Rent</h5>
              <p>Pay your monthly rent securely.</p>
            </div>
          </div>
          <div className="col-md-4 mb-3">
            <div
              className="card p-3 shadow-sm border-0"
              style={{
                borderRadius: "10px",
                backgroundColor: "#1A3D8F",
                color: "white",
              }}
            >
              <h5 className="h6 fw-bold">Subscriptions</h5>
              <p>Manage payments for streaming services and more.</p>
            </div>
          </div>
          <div className="col-md-4 mb-3">
            <div
              className="card p-3 shadow-sm border-0"
              style={{
                borderRadius: "10px",
                backgroundColor: "#1A3D8F",
                color: "white",
              }}
            >
              <h5 className="h6 fw-bold">Tuition</h5>
              <p>Pay school or university tuition fees.</p>
            </div>
          </div>
          <div className="col-md-4 mb-3">
            <div
              className="card p-3 shadow-sm border-0"
              style={{
                borderRadius: "10px",
                backgroundColor: "#1A3D8F",
                color: "white",
              }}
            >
              <h5 className="h6 fw-bold">Insurance</h5>
              <p>Pay premiums for health, auto, or home insurance.</p>
            </div>
          </div>
          <div className="col-md-4 mb-3">
            <div
              className="card p-3 shadow-sm border-0"
              style={{
                borderRadius: "10px",
                backgroundColor: "#1A3D8F",
                color: "white",
              }}
            >
              <h5 className="h6 fw-bold">Others</h5>
              <p>Pay for miscellaneous services and bills.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Modal to show the Pay Bills form */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Pay a Bill"
      >
        <PayBillsForm onClose={() => setIsModalOpen(false)} />
      </Modal>
    </div>
  );
};

export default BillPaymentPage;