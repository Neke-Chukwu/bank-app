import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PendingApprovalsTable from "../Components/PendingApprovalsTable";

const AdminHome = () => {
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [approvals, setApprovals] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [loadingApprovals, setLoadingApprovals] = useState(true);

  // Fetch all users except admins
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("http://localhost:5000/api/admin/users", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch users");
        }

        const data = await response.json();
        setUsers(data.users);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoadingUsers(false);
      }
    };

    fetchUsers();
  }, []);

  // Fetch loans pending approval
  useEffect(() => {
    const fetchApprovals = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("http://localhost:5000/api/loans/pending", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch pending approvals");
        }

        const data = await response.json();
        setApprovals(data.loans);
      } catch (error) {
        console.error("Error fetching pending approvals:", error);
      } finally {
        setLoadingApprovals(false);
      }
    };

    fetchApprovals();
  }, []);

  // Filtered Users
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user._id.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === "All" || user.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleViewUser = (userId) => {
    navigate(`/admin/manage-users/${userId}`);
  };
  
  return (
    <div className="min-vh-100">
      {/* Users Section */}
      <section className="mb-5">
        <h2 className="fw-bold mb-3">Users</h2>
        {loadingUsers ? (
          <p>Loading users...</p>
        ) : (
          <>
            {/* Search & Filter Controls */}
            <div className="row mb-3">
              <div className="col-md-6 mb-2">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search by name, email, or ID"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="col-md-3 mb-2">
                <select
                  className="form-select"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="All">Status: All</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>

            {/* Users Data Table */}
            <div className="table-responsive mb-3">
              <table className="table table-hover align-middle">
                <thead className="table-light">
                  <tr>
                    <th>User ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Status</th>
                    <th>Role</th>
                    <th>Created</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <tr key={user._id}>
                      <td>{user._id}</td>
                      <td>{user.username}</td>
                      <td>{user.email}</td>
                      <td>
                        <span
                          className={`badge ${
                            user.status === "active" ? "bg-success" : "bg-danger"
                          }`}
                        >
                          {user.status}
                        </span>
                      </td>
                      <td>{user.role}</td>
                      <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                      <td>
                        <button
                          className="btn btn-sm"
                          style={{ color: "white", backgroundColor: "#1A3D8F" }}
                          onClick={() => handleViewUser(user._id)}
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </section>

      {/* Pending Approvals Section */}
      <section>
        <h2 className="fw-bold mb-3">Pending Approvals</h2>
        {loadingApprovals ? (
          <p>Loading pending approvals...</p>
        ) : (
          <PendingApprovalsTable approvals={approvals} />
        )}
      </section>
    </div>
  );
};

export default AdminHome;