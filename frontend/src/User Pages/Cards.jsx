import React, { useState, useEffect } from "react";
import Modal from "../Components/Modal";
import CreditCard from "../Components/CreditCards"; // Import the updated CreditCard component

export default function Cards() {
  const [showModal, setShowModal] = useState(false);
  const [selectedCardType, setSelectedCardType] = useState(null);
  const [selectedCardBrand, setSelectedCardBrand] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [cards, setCards] = useState({ credit: null, debit: null }); // Store generated cards
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    // Load existing cards from localStorage
    const storedCards = JSON.parse(localStorage.getItem("cards")) || { credit: null, debit: null };
    setCards(storedCards);
  }, []);

  const handleApplyForCard = () => {
    setShowModal(true);
    setSelectedCardType(null);
    setSelectedCardBrand(null);
    setErrorMessage("");
  };

  const handleCardSelection = (type, brand) => {
    if (cards[type.toLowerCase()]) {
      setErrorMessage(`You can only have one ${type} card.`);
      return;
    }

    setIsProcessing(true);
    setTimeout(() => {
      const newCard = {
        type,
        brand,
        number: "1234 5678 9012 3456",
        expiry: "12/28",
        holder: "Paschal Obunikechukwu",
        cvv: "123",
      };
      const updatedCards = { ...cards, [type.toLowerCase()]: newCard };
      setCards(updatedCards);
      localStorage.setItem("cards", JSON.stringify(updatedCards)); // Save cards to localStorage
      setIsProcessing(false);
      setShowModal(false);
    }, 4000); // Simulate 4-second delay
  };

  return (
    <div className="container py-5">
      <h2 className="text-center mb-4" style={{ color: "#1A3D8F" }}>Manage Your Cards</h2>
      <div className="bg-light p-4 rounded shadow-sm mb-4">
        <p className="mb-0 text-muted">
          Manage your debit and credit cards with ease. Apply for a new card, view your existing cards, and enjoy secure transactions with our trusted card partners.
        </p>
      </div>

      {/* Existing Cards */}
      <div className="row mb-4">
        {cards.credit && (
          <div className="col-md-6 mb-4">
            <CreditCard card={cards.credit} />
          </div>
        )}
        {cards.debit && (
          <div className="col-md-6 mb-4">
            <CreditCard card={cards.debit} />
          </div>
        )}
      </div>

      {/* Apply for Card Button */}
      <div className="text-center">
        <button
          className="btn btn-primary btn-lg"
          style={{ backgroundColor: "#1A3D8F", borderColor: "#1A3D8F", borderRadius: "5px" }}
          onClick={handleApplyForCard}
        >
          Apply for a Debit/Credit Card
        </button>
      </div>

      <button
        className="btn btn-danger"
        onClick={() => {
         localStorage.removeItem("cards");
         window.location.reload(); // Refresh the page to reflect changes
         }}
        >
        Clear Stored Cards
      </button>

      {/* Modal for Card Application */}
      {showModal && (
        <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Apply for a Card">
          {isProcessing ? (
            <div className="text-center">
              <i className="fas fa-spinner fa-spin text-primary mb-3" style={{ fontSize: "24px" }}></i>
              <p>Processing your card application, please wait...</p>
            </div>
          ) : !selectedCardType ? (
            <>
              <h5 className="text-center mb-4">What type of card would you like to apply for?</h5>
              <div className="d-flex justify-content-around">
                <button
                  className="btn btn-outline-primary d-flex flex-column align-items-center"
                  style={{
                    borderColor: "#1A3D8F",
                    color: "#1A3D8F",
                    width: "120px",
                    height: "120px",
                    borderRadius: "10px",
                  }}
                  onClick={() => setSelectedCardType("Debit")}
                >
                  <i className="fas fa-credit-card fa-2x mb-2"></i>
                  Debit Card
                </button>
                <button
                  className="btn btn-outline-primary d-flex flex-column align-items-center"
                  style={{
                    borderColor: "#1A3D8F",
                    color: "#1A3D8F",
                    width: "120px",
                    height: "120px",
                    borderRadius: "10px",
                  }}
                  onClick={() => setSelectedCardType("Credit")}
                >
                  <i className="fas fa-money-check-alt fa-2x mb-2"></i>
                  Credit Card
                </button>
              </div>
            </>
          ) : !selectedCardBrand ? (
            <>
              <h5 className="text-center mb-4">Choose your card brand</h5>
              <div className="d-flex flex-wrap justify-content-around">
                {[
                  { brand: "Verve", icon: "fab fa-cc-diners-club" },
                  { brand: "Visa", icon: "fab fa-cc-visa" },
                  { brand: "MasterCard", icon: "fab fa-cc-mastercard" },
                  { brand: "Discover", icon: "fab fa-cc-discover" },
                  { brand: "American Express", icon: "fab fa-cc-amex" },
                ].map(({ brand, icon }) => (
                  <button
                    key={brand}
                    className="btn btn-outline-primary d-flex flex-column align-items-center m-2"
                    style={{
                      borderColor: "#1A3D8F",
                      color: "#1A3D8F",
                      width: "120px",
                      height: "120px",
                      borderRadius: "10px",
                    }}
                    onClick={() => handleCardSelection(selectedCardType, brand)}
                  >
                    <i className={`${icon} fa-2x mb-2`}></i>
                    {brand}
                  </button>
                ))}
              </div>
            </>
          ) : null}
          {errorMessage && <p className="text-danger text-center mt-3">{errorMessage}</p>}
        </Modal>
      )}
    </div>
  );
}