import React, { useState } from "react";
import Modal from "../Components/Modal"; // Import the Modal component

const PendingApprovalsTable = ({ approvals, setApprovals }) => {
  const [selectedApproval, setSelectedApproval] = useState(null); // Track the selected approval
  const [modalAction, setModalAction] = useState(""); // Track the action (Approve/Reject)
  const [isModalOpen, setIsModalOpen] = useState(false); // Track modal visibility
  const [loadingAction, setLoadingAction] = useState(false); // Track loading state for actions

  const handleAction = (approval, action) => {
    setSelectedApproval(approval);
    setModalAction(action);
    setIsModalOpen(true); // Show the modal
  };

  const confirmAction = async () => {
    if (!selectedApproval) return;

    try {
      setLoadingAction(true);

      const token = localStorage.getItem("token");
      const response = await fetch(
        `https://api.neontrust.us/api/loans/${selectedApproval.id}/${modalAction.toLowerCase()}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to ${modalAction.toLowerCase()} the loan`);
      }

      const data = await response.json();

      // Update the UI dynamically
      setApprovals((prevApprovals) =>
        prevApprovals.filter((approval) => approval.id !== selectedApproval.id)
      );

      console.log(`${modalAction} action confirmed for ${selectedApproval.id}`);
      console.log("Updated Loan:", data.loan); // Debugging: Log the updated loan
    } catch (error) {
      console.error(`Error performing ${modalAction.toLowerCase()} action:`, error);
    } finally {
      setLoadingAction(false);
      setIsModalOpen(false); // Close the modal
    }
  };

  return (
    <>
      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={`${modalAction} Approval`}
      >
        <p>
          Are you sure you want to {modalAction.toLowerCase()} the approval for{" "}
          <strong>{selectedApproval?.requester}</strong>?
        </p>
        <div className="d-flex justify-content-end mt-4">
          <button
            className="btn btn-secondary me-2"
            onClick={() => setIsModalOpen(false)}
            disabled={loadingAction}
          >
            Cancel
          </button>
          <button
            className="btn btn-primary"
            onClick={confirmAction}
            style={{ color: "white", backgroundColor: "#1A3D8F" }}
            disabled={loadingAction}
          >
            {loadingAction ? "Processing..." : "Confirm"}
          </button>
        </div>
      </Modal>

      <div className="table-responsive">
        <table className="table table-hover align-middle">
          <thead className="table-light">
            <tr>
              <th>Approval ID</th>
              <th>Type</th>
              <th>Requester</th>
              <th>Amount</th>
              <th>Date Requested</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {approvals.length > 0 ? (
              approvals.map((approval) => (
                <tr key={approval.id}>
                  <td>{approval.id || "N/A"}</td>
                  <td>{approval.type || "N/A"}</td>
                  <td>{approval.requester || "N/A"}</td>
                  <td>
                    {approval.amount !== undefined
                      ? `$${approval.amount.toLocaleString()}`
                      : "N/A"}
                  </td>
                  <td>
                    {approval.dateRequested
                      ? new Date(approval.dateRequested).toLocaleDateString()
                      : "N/A"}
                  </td>
                  <td>
                    <span
                      className={`badge ${
                        approval.status === "Pending"
                          ? "bg-warning"
                          : approval.status === "Approved"
                          ? "bg-success"
                          : "bg-danger"
                      }`}
                    >
                      {approval.status || "N/A"}
                    </span>
                  </td>
                  <td>
                    <div className="dropdown">
                      <button
                        className="btn btn-sm btn-secondary dropdown-toggle"
                        type="button"
                        id={`dropdownMenuButton-${approval.id}`}
                        style={{ color: "white", backgroundColor: "#1A3D8F" }}
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                      >
                        Actions
                      </button>
                      <ul
                        className="dropdown-menu"
                        aria-labelledby={`dropdownMenuButton-${approval.id}`}
                      >
                        <li>
                          <button
                            className="dropdown-item text-success fw-bold"
                            onClick={() => handleAction(approval, "Approve")}
                          >
                            Approve
                          </button>
                        </li>
                        <li>
                          <button
                            className="dropdown-item text-danger fw-bold"
                            onClick={() => handleAction(approval, "Reject")}
                          >
                            Reject
                          </button>
                        </li>
                      </ul>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center">
                  No pending approvals.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default PendingApprovalsTable;