import React, { useState, useEffect } from "react";
import axios from "axios";
import Modal from "../Components/Modal";
import CreditCard from "../Components/CreditCards";

export default function Cards() {
  const [showModal, setShowModal] = useState(false);
  const [selectedCardType, setSelectedCardType] = useState(null);
  const [selectedCardBrand, setSelectedCardBrand] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [cards, setCards] = useState({ credit: null, debit: null });
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchCards = async () => {
      try {
        const token = localStorage.getItem("token") || sessionStorage.getItem("token");
        if (!token) {
          setErrorMessage("Please log in to view your cards.");
          return;
        }

        const response = await axios.get("http://localhost:5000/api/card/all", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const fetchedCards = response.data.cards.reduce(
          (acc, card) => ({
            ...acc,
            [card.cardType]: {
              type: card.cardType.charAt(0).toUpperCase() + card.cardType.slice(1),
              brand: localStorage.getItem(`cardBrand_${card.cardType}`) || "Visa",
              number: card.cardNumber,
              expiry: card.expiryDate,
              holder: card.cardHolderName,
              cvv: card.cvv,
              id: card._id,
            },
          }),
          { credit: null, debit: null }
        );

        setCards(fetchedCards);
      } catch (error) {
        console.error("Error fetching cards:", error);
        setErrorMessage(error.response?.data?.message || "Failed to load cards.");
      }
    };

    fetchCards();
  }, []);

  const handleApplyForCard = () => {
    setShowModal(true);
    setSelectedCardType(null);
    setSelectedCardBrand(null);
    setErrorMessage("");
  };

  const handleCardSelection = async (type, brand) => {
    if (cards[type.toLowerCase()]) {
      setErrorMessage(`You can only have one ${type} card.`);
      return;
    }

    setIsProcessing(true);
    setErrorMessage("");

    try {
      const token = localStorage.getItem("token") || sessionStorage.getItem("token");
      if (!token) {
        throw new Error("Please log in to generate a card.");
      }

      const response = await axios.post(
        "http://localhost:5000/api/card/generate",
        { cardType: type.toLowerCase() },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Maintain 4-second loading state
      await new Promise((resolve) => setTimeout(resolve, 4000));

      const newCard = {
        type,
        brand,
        number: response.data.card.cardNumber,
        expiry: response.data.card.expiryDate,
        holder: response.data.card.cardHolderName,
        cvv: response.data.card.cvv,
        id: response.data.card._id,
      };

      console.log("New Card:", newCard);

      const updatedCards = { ...cards, [type.toLowerCase()]: newCard };
      setCards(updatedCards);
      localStorage.setItem(`cardBrand_${type.toLowerCase()}`, brand);
      setIsProcessing(false);
      setShowModal(false);
    } catch (error) {
      console.error("Error generating card:", error);
      await new Promise((resolve) => setTimeout(resolve, 4000));
      setIsProcessing(false);
      setErrorMessage(error.response?.data?.message || "Failed to generate card.");
    }
  };

  const handleDeleteCard = async (cardId, cardType) => {
    setIsProcessing(true);
    setErrorMessage("");
  
    try {
      const token = localStorage.getItem("token") || sessionStorage.getItem("token");
      if (!token) {
        throw new Error("Please log in to delete a card.");
      }
  
      await axios.delete(`http://localhost:5000/api/card/delete/${cardId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      // Update the local state to remove the deleted card
      setCards((prevCards) => ({
        ...prevCards,
        [cardType.toLowerCase()]: null,
      }));
    } catch (error) {
      console.error("Error deleting card:", error);
      setErrorMessage(error.response?.data?.message || "Failed to delete card.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="container py-5">
      <h2 className="text-center mb-4" style={{ color: "#1A3D8F" }}>
        Manage Your Cards
      </h2>
      <div className="bg-light p-4 rounded shadow-sm mb-4">
        <p className="mb-0 text-muted">
          Manage your debit and credit cards with ease. Apply for a new card, view your existing cards, and enjoy secure transactions with our trusted card partners.
        </p>
      </div>

      {/* Existing Cards */}
      <div className="row mb-4">
        {cards.credit && (
          <div className="col-md-6 mb-4">
            <CreditCard
              card={cards.credit}
              onDelete={() => handleDeleteCard(cards.credit.id, cards.credit.type)}
            />
          </div>
        )}
        {cards.debit && (
          <div className="col-md-6 mb-4">
            <CreditCard
              card={cards.debit}
              onDelete={() => handleDeleteCard(cards.debit.id, cards.debit.type)}
            />
          </div>
        )}
      </div>

      {/* Apply for Card Button */}
      <div className="text-center">
        <button
          className="btn btn-primary btn-lg"
          style={{
            backgroundColor: "#1A3D8F",
            borderColor: "#1A3D8F",
            borderRadius: "5px",
          }}
          onClick={handleApplyForCard}
        >
          Apply for a Debit/Credit Card
        </button>
      </div>

      {/* Modal for Card Application */}
      {showModal && (
        <Modal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          title="Apply for a Card"
        >
          {isProcessing ? (
            <div className="text-center">
              <i
                className="fas fa-spinner fa-spin text-primary mb-3"
                style={{ fontSize: "24px" }}
              ></i>
              <p>Processing your card application, please wait...</p>
            </div>
          ) : !selectedCardType ? (
            <>
              <h5 className="text-center mb-4">
                What type of card would you like to apply for?
              </h5>
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
          {errorMessage && (
            <p className="text-danger text-center mt-3">{errorMessage}</p>
          )}
        </Modal>
      )}
    </div>
  );
}