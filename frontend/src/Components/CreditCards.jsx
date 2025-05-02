import React, { useState } from "react";

const CreditCard = ({ card }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [showNumber, setShowNumber] = useState(false);

  const cardDesigns = {
    Visa: "#1a3d8f",
    MasterCard: "#ff6f61",
    Discover: "#f4a261",
    "American Express": "#2a9d8f",
    Verve: "#6a0572",
  };

  const cardIconClasses = {
    Visa: "fab fa-cc-visa",
    MasterCard: "fab fa-cc-mastercard",
    Discover: "fab fa-cc-discover",
    "American Express": "fab fa-cc-amex",
    Verve: "fab fa-cc-diners-club",
  };

  return (
    <div className="credit-card-container">
      <div
        className={`credit-card ${isFlipped ? "flipped" : ""}`}
        style={{ backgroundColor: cardDesigns[card.brand] || "#1a3d8f" }}
      >
        {/* Tag for Debit or Credit */}
        <div
          className="card-type-tag"
          style={{
            position: "absolute",
            top: "10px",
            left: "10px",
            backgroundColor: "rgba(0, 0, 0, 0.6)",
            color: "white",
            padding: "5px 10px",
            borderRadius: "5px",
            fontSize: "0.8rem",
            fontWeight: "bold",
          }}
        >
          {card.type} Card
        </div>

        {/* Front */}
        <div className="card-front">
          <div className="card-chip" />
          <div className="card-logo">
            <i className={`${cardIconClasses[card.brand]} fa-2x`} />
          </div>
          <div className="card-number">
            {showNumber ? card.number : "**** **** **** 3456"}
          </div>
          <div className="credit-card-footer text-start">
            <div>
              <small>Card Holder</small>
              <p>{card.holder}</p>
            </div>
            <div>
              <small>Expires</small>
              <p>{card.expiry}</p>
            </div>
          </div>
        </div>

        {/* Back */}
        <div className="card-back">
          <div className="card-stripe" />
          <div className="card-cvv">
            <small>CVV</small>
            <div className="cvv-box">{showNumber ? card.cvv : "***"}</div>
          </div>
          <div className="card-signature">Authorized Signature</div>
        </div>
      </div>

      {/* Controls */}
      <div className="mt-3 d-flex gap-2">
        <button
          className="btn btn-sm"
          style={{
            backgroundColor: "#1A3D8F",
            color: "white",
            borderRadius: "5px",
          }}
          onClick={() => setShowNumber((prev) => !prev)}
        >
          {showNumber ? "Hide Card Number" : "Show Card Number"}
        </button>
        <button
          className="btn btn-outline-secondary btn-sm"
          onClick={() => setIsFlipped((prev) => !prev)}
        >
          {isFlipped ? "Show Front" : "Flip Card"}
        </button>
      </div>
    </div>
  );
};

export default CreditCard;