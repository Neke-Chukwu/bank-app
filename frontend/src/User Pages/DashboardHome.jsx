import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Modal from "../Components/Modal";
import LocalTransferForm from "../Forms/LocalTransferForm";
import InternationalTransferForm from "../Forms/InternationalTransferForm";
import PayBillsForm from "../Forms/PayBillsForm";
import TransactionHistoryTable from "../Components/TransactionHistoryTable";
import CreditCard from "../Components/CreditCards";
import axios from "axios";
import Suspended from "./Suspended";

// Error Boundary Component
class DashboardErrorBoundary extends React.Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="container p-4 text-center">
          <h4 className="text-danger">Something went wrong.</h4>
          <p>Please try refreshing the page or contact support.</p>
          <button
            className="btn btn-primary"
            style={{ backgroundColor: "#1A3D8F", borderColor: "#1A3D8F" }}
            onClick={() => window.location.reload()}
          >
            Refresh
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

const DashboardHome = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeModal, setActiveModal] = useState(null);
  const [cardDetails, setCardDetails] = useState(null);
  const [username, setUsername] = useState("John");
  const [accounts, setAccounts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSuspended, setIsSuspended] = useState(false);

  const navigate = useNavigate();

  const closeModal = () => setActiveModal(null);

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("token") || sessionStorage.getItem("token");

      if (!token) {
        console.error("No token found. Redirecting to login...");
        navigate("/login");
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const [userResponse, accountsResponse, transactionsResponse, cardsResponse] = await Promise.all([
          axios.get("http://localhost:5000/api/users/user", {
            headers: { Authorization: `Bearer ${token}` },
          }).catch(err => ({ error: err })),
          axios.get("http://localhost:5000/api/users/accounts", {
            headers: { Authorization: `Bearer ${token}` },
          }).catch(err => ({ error: err })),
          axios.get("http://localhost:5000/api/transfers/transactions", {
            headers: { Authorization: `Bearer ${token}` },
          }).catch(err => ({ error: err })),
          axios.get("http://localhost:5000/api/card/all", {
            headers: { Authorization: `Bearer ${token}` },
          }).catch(err => ({ error: err })),
        ]);

        // Handle user response
        if (userResponse.error) {
          console.error("User fetch error:", userResponse.error);
        } else if (!userResponse.data?.user?.username) {
          console.warn("Invalid user data:", userResponse.data);
        } else {
          setUsername(userResponse.data.user.username);
          setIsSuspended(userResponse.data.user.status === false);
        }

        // Skip further data fetching if user is suspended
        if (userResponse.data?.user?.status === false) {
          setLoading(false);
          return;
        }

        // Handle accounts response
        if (accountsResponse.error) {
          console.error("Accounts fetch error:", accountsResponse.error);
        } else {
          const accountsData = accountsResponse.data?.accounts || accountsResponse.data || [];
          console.log("Accounts data:", accountsData);
          setAccounts(Array.isArray(accountsData) ? accountsData : []);
        }

        // Handle transactions response
        if (transactionsResponse.error) {
          console.error("Transactions fetch error:", transactionsResponse.error);
        } else {
          const transactionsData = transactionsResponse.data?.transfers || transactionsResponse.data || [];
          console.log("Transactions data:", transactionsData);
          setTransactions(Array.isArray(transactionsData) ? transactionsData : []);
        }

        // Handle cards response
        if (cardsResponse.error) {
          console.warn("Cards fetch error:", cardsResponse.error.message);
        } else {
          setCardDetails(cardsResponse.data?.cards || null);
        }

        // Only set error if all critical fetches fail
        if (
          userResponse.error &&
          accountsResponse.error &&
          transactionsResponse.error
        ) {
          throw new Error("Failed to load critical data");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setError(error.message || "Failed to load data");
        if (error.response?.status === 403) {
          localStorage.removeItem("token");
          sessionStorage.removeItem("token");
          navigate("/login");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleDeleteCard = async (cardId, cardType) => {
    try {
      const token = localStorage.getItem("token") || sessionStorage.getItem("token");
      if (!token) {
        throw new Error("Please log in to delete a card.");
      }

      await axios.delete(`http://localhost:5000/api/card/delete/${cardId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Update cardDetails state
      setCardDetails((prev) => ({
        ...prev,
        [cardType.toLowerCase()]: null,
      }));
      localStorage.removeItem(`cardBrand_${cardType.toLowerCase()}`);
    } catch (error) {
      console.error("Error deleting card:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");
    navigate("/login");
  };

  const filteredTransactions = useMemo(() => {
    if (!Array.isArray(transactions)) return [];
    return transactions.filter((transaction) => {
      const recipientName = transaction.recipientName?.toString().toLowerCase() || "";
      const recipientBank = transaction.recipientBank?.toString().toLowerCase() || "";
      const query = searchQuery.toLowerCase();
      return recipientName.includes(query) || recipientBank.includes(query);
    }).slice(0, 5); // Ensure up to 5 transactions for Recent Transactions
  }, [searchQuery, transactions]);

  const totalBalance = accounts.reduce((sum, account) => sum + (account.balance || 0), 0);

  const quickActions = [
    {
      id: 1,
      name: "Send Money",
      icon: "fa-exchange-alt",
      content: (
        <div className="text-center">
          <h6 className="mb-3 fw-semibold">Choose Transfer Type</h6>
          <div className="d-flex justify-content-center gap-4 flex-wrap">
            <div
              className="p-3 rounded-4 shadow-sm text-center bg-light"
              role="button"
              style={{ width: "140px" }}
              onClick={() => setActiveModal("localTransfer")}
            >
              <i className="fas fa-money-bill-transfer fs-2 mb-2" style={{ color: "#1A3D8F" }}></i>
              <div className="fw-medium">Local</div>
            </div>
            <div
              className="p-3 rounded-4 shadow-sm text-center bg-light"
              role="button"
              style={{ width: "140px" }}
              onClick={() => setActiveModal("internationalTransfer")}
            >
              <i className="fas fa-globe-africa fs-2 mb-2" style={{ color: "#1A3D8F" }}></i>
              <div className="fw-medium">International</div>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 2,
      name: "Pay Bills",
      icon: "fa-file-invoice",
      content: <PayBillsForm />,
    },
    {
      id: 3,
      name: "E-Statement",
      icon: "fa-mobile-alt",
      content: (
        <div>
          <p>
            Your e-statement will be sent to the email address associated with your account. Please allow a few minutes
            for the statement to arrive.
          </p>
          <p>
            If you do not receive the statement within 10 minutes, kindly check your spam or junk folder. For any issues
            or further assistance, please contact our support team.
          </p>
          <button
            className="btn w-100"
            onClick={closeModal}
            style={{ backgroundColor: "#1A3D8F", color: "white" }}
          >
            Close
          </button>
        </div>
      ),
    },
    {
      id: 4,
      name: "Invest",
      icon: "fa-chart-line",
      content: (
        <div>
          <p>Looking to grow your funds? We help clients invest smartly and securely.</p>
          <button
            className="btn btn-primary"
            onClick={() => setActiveModal("investDetails")}
            style={{ backgroundColor: "#1A3D8F", color: "white" }}
          >
            Talk to Our Support Team
          </button>
        </div>
      ),
    },
  ];

  // Modal content map for efficiency
  const modalContentMap = {
    "Send Money": quickActions.find((action) => action.name === "Send Money").content,
    "Pay Bills": quickActions.find((action) => action.name === "Pay Bills").content,
    "E-Statement": quickActions.find((action) => action.name === "E-Statement").content,
    "Invest": quickActions.find((action) => action.name === "Invest").content,
    "investDetails": (
      <div>
        <p className="mb-3">
          Great! Click the button below to send us an email. Our support team will respond with investment details.
        </p>
        <a
          href="mailto:support@yourbank.com"
          className="btn"
          style={{ backgroundColor: "#1A3D8F", color: "white" }}
          onClick={closeModal}
        >
          Contact Support via Email
        </a>
      </div>
    ),
    "localTransfer": <LocalTransferForm userAccounts={accounts} />,
    "internationalTransfer": <InternationalTransferForm userAccounts={accounts} />,
  };

  if (isSuspended) {
    return <Suspended />;
  }

  if (loading) {
    return (
      <div className="container p-4 text-center">
        <div className="spinner-border" style={{ color: "#1A3D8F" }} role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container p-4 text-center">
        <h4 className="text-danger">Error: {error}</h4>
        <button
          className="btn btn-primary"
          style={{ backgroundColor: "#1A3D8F", borderColor: "#1A3D8F" }}
          onClick={() => window.location.reload()}
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <DashboardErrorBoundary>
      <div className="bg-light d-flex">
        <div className="flex-grow-1 p-4">
          {/* Header */}
          <header className="bg-white shadow-sm p-3 mb-4">
            <div className="d-flex justify-content-between align-items-center">
              <h1 className="h5 mb-0">Good morning, {username}</h1>
              <div className="d-flex align-items-center">
                <div className="dropdown">
                  <button
                    className="btn rounded-circle"
                    style={{
                      backgroundColor: "#1A3D8F",
                      color: "white",
                      width: "40px",
                      height: "40px",
                    }}
                    id="profileDropdown"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    <i className="fas fa-user-circle"></i>
                  </button>
                  <ul
                    className="dropdown-menu dropdown-menu-end"
                    aria-labelledby="profileDropdown"
                    style={{ backgroundColor: "white" }}
                  >
                    <li>
                      <button
                        className="dropdown-item"
                        onClick={() => navigate("/user/profile")}
                        style={{ color: "#1A3D8F" }}
                      >
                        Profile
                      </button>
                    </li>
                    <li>
                      <button
                        className="dropdown-item"
                        onClick={() => navigate("/user/password-reset")}
                        style={{ color: "#1A3D8F" }}
                      >
                        Password Reset
                      </button>
                    </li>
                    <li>
                      <button
                        className="dropdown-item"
                        onClick={handleLogout}
                        style={{ color: "#1A3D8F" }}
                      >
                        Logout
                      </button>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </header>

          {/* Account Summary */}
          <div className="mb-4">
            <p className="h4 fw-bold">Account Summary</p>
            <h2 className="h4 text-muted my-4">
              Total Balance: $
              {totalBalance.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </h2>
            {accounts.length === 0 ? (
              <p className="text-muted">No accounts found.</p>
            ) : (
              <div className="row g-3">
                {accounts.map((account) => (
                  <div key={account.number} className="col-md-4">
                    <div
                      className="card p-3 shadow-sm border-0 account-card"
                      style={{
                        borderRadius: "10px",
                        backgroundColor: "#1A3D8F",
                        color: "white",
                      }}
                    >
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <h5 className="h6 fw-bold">{account.type}</h5>
                        <small>{account.number}</small>
                      </div>
                      <p className="h5 fw-bold">
                        $
                        {account.balance.toLocaleString("en-US", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="mb-4">
            <h2 className="h5 mb-3">Quick Actions</h2>
            <div className="row g-3">
              {quickActions.map((action) => (
                <div key={action.id} className="col-6 col-sm-4 col-md-2 text-center">
                  <div
                    className="card p-3 shadow-sm"
                    onClick={() => setActiveModal(action.name)}
                    style={{ cursor: "pointer" }}
                  >
                    <div
                      className="rounded-circle text-white d-flex align-items-center justify-content-center mx-auto mb-2"
                      style={{ width: "50px", height: "50px", backgroundColor: "#1A3D8F" }}
                    >
                      <i className={`fas ${action.icon}`}></i>
                    </div>
                    <span className="small">{action.name}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Card Section */}
          <div className="card shadow-sm mb-4">
            <div className="m-4 card-header bg-white border-0">
              <h2 className="h5 mb-3">Your Cards</h2>
              <p className="text-muted">View and manage your debit and credit cards.</p>
            </div>
            <div className="card-body text-center">
              {cardDetails && (cardDetails.credit || cardDetails.debit) ? (
                <>
                  <div className="row">
                    <div className="col-md-6 mb-4">
                      <CreditCard
                        card={cardDetails.credit || cardDetails.debit}
                        onDelete={() =>
                          handleDeleteCard(
                            (cardDetails.credit || cardDetails.debit).id,
                            (cardDetails.credit || cardDetails.debit).type
                          )
                        }
                      />
                    </div>
                  </div>
                </>
              ) : (
                <div>
                  <p className="text-muted">No credit or debit card added to your account.</p>
                  <button
                    className="btn btn-primary"
                    style={{ backgroundColor: "#1A3D8F", borderColor: "#1A3D8F" }}
                    onClick={() => navigate("/user/cards")}
                  >
                    Go to Cards
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Recent Transactions */}
          <div className="card shadow-sm">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h6>Recent Transactions</h6>
                <div className="input-group" style={{ maxWidth: "300px" }}>
                  <span className="input-group-text">
                    <i className="fas fa-search"></i>
                  </span>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search transactions"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
              {filteredTransactions.length === 0 ? (
                <p className="text-muted text-center">No recent transactions found.</p>
              ) : (
                <TransactionHistoryTable
                  transactions={filteredTransactions}
                  totalTransactions={filteredTransactions.length}
                  limit={5}
                  currentPage={1}
                  showPagination={false}
                />
              )}
            </div>
            <div className="text-center mt-3">
              <button
                className="btn btn-link"
                style={{ color: "#1A3D8F" }}
                onClick={() => navigate("/user/transactions")}
              >
                View all transactions
              </button>
            </div>
          </div>

          {/* Modals */}
          {activeModal && modalContentMap[activeModal] && (
            <Modal isOpen={true} onClose={closeModal} title={activeModal}>
              {modalContentMap[activeModal]}
            </Modal>
          )}
        </div>
      </div>
    </DashboardErrorBoundary>
  );
};

export default DashboardHome;