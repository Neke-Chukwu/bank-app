import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Modal from "../Components/Modal";
import LocalTransferForm from "../Forms/LocalTransferForm";
import InternationalTransferForm from "../Forms/InternationalTransferForm";
import PayBillsForm from "../Forms/PayBillsForm";
import TransactionHistoryTable from "../Components/TransactionHistoryTable"; // Import the new component
import CreditCard from "../Components/CreditCards";
import axios from "axios"; // Import axios for API calls

const DashboardHome = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeModal, setActiveModal] = useState(null);
  const [cardDetails, setCardDetails] = useState(null);
  const [username, setUsername] = useState("John");
  const [accounts, setAccounts] = useState([]);
  const [transactions, setTransactions] = useState([]); // Initialize as an empty array
  const [filteredTransactions, setFilteredTransactions] = useState([]); // Initialize as an empty array

  const navigate = useNavigate();

  const closeModal = () => setActiveModal(null);

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("token") || sessionStorage.getItem("token");

      if (!token) {
        console.error("No token found in localStorage. Redirecting to login...");
        navigate("/login");
        return;
      }

      try {
        const userResponse = await axios.get("http://localhost:5000/api/users/user", {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        setUsername(userResponse.data.user.username);

        const accountsResponse = await axios.get("http://localhost:5000/api/users/accounts", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAccounts(accountsResponse.data.accounts);

        const transactionsResponse = await axios.get("http://localhost:5000/api/transfers/transactions", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTransactions(transactionsResponse.data.transactions || []); // Ensure transactions is always an array
        setFilteredTransactions(transactionsResponse.data.transactions || []); // Initialize filtered transactions
      } catch (error) {
        console.error("Error fetching user data, accounts, or transactions:", error);

        if (error.response && error.response.status === 403) {
          localStorage.removeItem("token");
          navigate("/login");
        }
      }
    };

    fetchUserData();
  }, [navigate]);

  useEffect(() => {
    if (Array.isArray(transactions)) {
      const filtered = transactions.filter((transaction) =>
        transaction.recipientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        transaction.recipientBank?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        transaction.currency?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredTransactions(filtered);
    }
  }, [searchQuery, transactions]);

  const totalBalance = accounts.reduce((sum, account) => sum + account.balance, 0);



  const quickActions = [
    {
      id: 1,
      name: "Send Money",
      icon: "fa-exchange-alt",
      content: (
        <div className="text-center">
          <h6 className="mb-3 fw-semibold">Choose Transfer Type</h6>
          <div className="d-flex justify-content-center gap-4 flex-wrap">
            {/* Local Transfer */}
            <div
              className="p-3 rounded-4 shadow-sm text-center bg-light"
              role="button"
              style={{ width: "140px" }}
              onClick={() => setActiveModal("localTransfer")}
            >
              <i className="fas fa-money-bill-transfer fs-2 mb-2" style={{ color: "#1A3D8F" }}></i>
              <div className="fw-medium">Local</div>
            </div>

            {/* International Transfer */}
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
      content: (
        <div>
          <PayBillsForm />
        </div>
      ),
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

  return (
    <div className="bg-light d-flex">
      <div className="flex-grow-1 p-4">
        {/* Header */}
        <header className="bg-white shadow-sm p-3 mb-4">
          <div className="d-flex justify-content-between align-items-center">
            {/* Display fetched username */}
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
                  style={{ backgroundColor: "#white" }}
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
                </ul>
              </div>
            </div>
          </div>
        </header>

        {/* Account Summary */}
        <div className="mb-4">
          <p className="h4 fw-bold">Account Summary</p>
          <h2 className=" h4 text-muted my-4">
            Total Balance: $
            {totalBalance.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </h2>
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
            {cardDetails?.credit || cardDetails?.debit ? (
              <div className="row">
                {cardDetails.credit && (
                  <div className="col-md-6 mb-4">
                    <CreditCard card={cardDetails.credit} />
                  </div>
                )}
                {cardDetails.debit && (
                  <div className="col-md-6 mb-4">
                    <CreditCard card={cardDetails.debit} />
                  </div>
                )}
              </div>
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
            <TransactionHistoryTable
              transactions={filteredTransactions || []}
              totalTransactions={filteredTransactions?.length || 0}
              limit={5}
              currentPage={1}
              showPagination={false}
            />
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
        {activeModal === "Send Money" && (
          <Modal isOpen={true} onClose={closeModal} title="Send Money">
            {quickActions.find((action) => action.name === "Send Money").content}
          </Modal>
        )}

        {activeModal === "Pay Bills" && (
          <Modal isOpen={true} onClose={closeModal} title="Pay Bills">
            {quickActions.find((action) => action.name === "Pay Bills").content}
          </Modal>
        )}

        {activeModal === "E-Statement" && (
          <Modal isOpen={true} onClose={closeModal} title="E-Statement">
            {quickActions.find((action) => action.name === "E-Statement").content}
          </Modal>
        )}

        {activeModal === "Invest" && (
          <Modal isOpen={true} onClose={closeModal} title="Invest">
            {quickActions.find((action) => action.name === "Invest").content}
          </Modal>
        )}

        {activeModal === "Loan" && (
          <Modal isOpen={true} onClose={closeModal} title="Loan">
            {quickActions.find((action) => action.name === "Loan").content}
          </Modal>
        )}

        {activeModal === "More" && (
          <Modal isOpen={true} onClose={closeModal} title="More">
            {quickActions.find((action) => action.name === "More").content}
          </Modal>
        )}

        {activeModal === "localTransfer" && (
          <Modal isOpen={true} onClose={closeModal} title="Local Transfer">
            <LocalTransferForm 
            userAccounts={accounts}/>
          </Modal>
        )}

        {activeModal === "internationalTransfer" && (
          <Modal isOpen={true} onClose={closeModal} title="International Transfer">
            <InternationalTransferForm 
            userAccounts={accounts}/>
          </Modal>
        )}

        {activeModal === "investDetails" && (
          <Modal isOpen={true} onClose={closeModal} title="Invest Details">
                  <p className="mb-3">
                    Great! Click the button below to send us an email. Our support team will respond with investment details.
                  </p>
                  <a
                    href= "mailto: mailto:support@yourbank.com"
                    className="btn"
                    style={{ backgroundColor: "#1A3D8F", color: "white" }}
                    onClick={closeModal}
                  >
                    Contact Support via Email
                  </a>
          </Modal>
        )}
      </div>
    </div>
  );
};

export default DashboardHome;