import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";

const AdminHome = () => {
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");
    const [loadingUsers, setLoadingUsers] = useState(true);
    const [error, setError] = useState(null);

    // Fetch all users except admins
    const fetchUsers = useCallback(async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await fetch("http://localhost:5000/api/admin/users", {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error(`Failed to fetch users: ${response.status}`);
            }

            const data = await response.json();
            console.log("Fetched Users:", data);
            // Assuming data is an array based on console log
            setUsers(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Error fetching users:", error);
            setError(error.message);
        } finally {
            setLoadingUsers(false);
        }
    }, []);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    // Filtered Users
    const filteredUsers = (Array.isArray(users) ? users : []).filter((user) => {
        const userId = user._id || user.id || ""; // Handle both _id and id
        const matchesSearch =
            (user.username || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
            (user.email || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
            userId.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus =
            statusFilter === "All" ||
            (user.status || "").toLowerCase() === statusFilter.toLowerCase();
        return matchesSearch && matchesStatus;
    });

    console.log("Filtered Users:", filteredUsers);

    const handleViewUser = (userId) => {
        console.log("Navigating to user:", userId);
        navigate(`/admin/manage-users/${userId}`);
    };

    const checkState = () => {
        console.log("Current State:");
        console.log("Users:", users);
        console.log("Search Query:", searchQuery);
        console.log("Status Filter:", statusFilter);
        console.log("Loading Users:", loadingUsers);
        console.log("Filtered Users:", filteredUsers);
    };

    if (error) {
        return (
            <div className="container mx-auto p-4">
                <div className="alert alert-danger bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                    {error}
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 p-4">
            <div className="container mx-auto">
                <section className="mb-5">
                    <h2 className="text-2xl font-bold mb-3">Users</h2>
                    {loadingUsers ? (
                        <p className="text-gray-600">Loading users...</p>
                    ) : (
                        <>
                            <div className="flex flex-col md:flex-row mb-3 gap-3">
                                <div className="md:w-1/2">
                                    <input
                                        type="text"
                                        className="form-control w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Search by name, email, or ID"
                                        value={searchQuery}
                                        onChange={(e) => {
                                            setSearchQuery(e.target.value);
                                            console.log("Search Query Updated:", e.target.value);
                                        }}
                                    />
                                </div>
                                <div className="md:w-1/4">
                                    <select
                                        className="form-select w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        value={statusFilter}
                                        onChange={(e) => {
                                            setStatusFilter(e.target.value);
                                            console.log("Status Filter Updated:", e.target.value);
                                        }}
                                    >
                                        <option value="All">Status: All</option>
                                        <option value="active">Active</option>
                                        <option value="inactive">Inactive</option>
                                    </select>
                                </div>
                                <div className="md:w-1/4">
                                    <button
                                        onClick={checkState}
                                        className="btn w-full px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
                                    >
                                        Check State
                                    </button>
                                </div>
                            </div>

                            <div className="table-responsive mb-3">
                                <table className="table w-full border-collapse bg-white shadow-sm rounded-lg">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User ID</th>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {filteredUsers.length > 0 ? (
                                            filteredUsers.map((user) => (
                                                <tr key={user._id} className="hover:bg-gray-50">
                                                    <td className="px-4 py-3 text-sm text-gray-900">{user._id}</td>
                                                    <td className="px-4 py-3 text-sm text-gray-900">{user.username}</td>
                                                    <td className="px-4 py-3 text-sm text-gray-500">{user.email}</td>
                                                    <td className="px-4 py-3">
                                                        <span
                                                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${user.status === "active"
                                                                ? "bg-green-100 text-green-800"
                                                                : "bg-red-100 text-red-800"
                                                                }`}
                                                        >
                                                            {user.status}
                                                        </span>
                                                    </td>
                                                    <td className={`px-4 py-3 text-sm  ${user.role === 'admin' ? 'admin-role' : 'user-role'}`}>{user.role}</td>
                                                    <td className="px-4 py-3 text-sm text-gray-500">
                                                        {new Date(user.createdAt).toLocaleDateString()}
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <button
                                                            className="view-user-button px-3 py-1 text-sm text-white  rounded-md  text-xs"
                                                            onClick={() => handleViewUser(user._id)}
                                                        >
                                                            View User
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan={7} className="px-4 py-3 text-center text-gray-500">
                                                    No users found.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </>
                    )}
                </section>
            </div>
            <style jsx global>{`
                .view-user-button {
                  background-color: #3b82f6; /* Tailwind's blue-500 */
                  color: white;
                  font-weight: 600; /* Tailwind's font-semibold */
                  border-radius: 0.375rem; /* Tailwind's rounded-md */
                  padding-left: 0.75rem; /* Tailwind's px-3 */
                  padding-right: 0.75rem;
                  padding-top: 0.25rem; /* Tailwind's py-1 */
                  padding-bottom: 0.25rem;
                  transition: background-color 0.3s ease; /* Smooth transition */
                }
                .view-user-button:hover {
                    background-color: #2563eb; /* Tailwind's blue-700 on hover */
                }

                .admin-role {
                    background-color: #f87171; /* Tailwind's red-400 */
                    color: white;
                    padding: 0.25rem 0.5rem;
                    border-radius: 0.375rem;
                }
                .admin-role:hover {
                      background-color: #ef4444; /* Tailwind's red-600 */
                }

                .user-role{
                    background-color: #16a34a; /* Tailwind's green-500 */
                    color: white;
                    padding: 0.25rem 0.5rem;
                    border-radius: 0.375rem;
                }

                .user-role:hover {
                    background-color: #15803d; /* Tailwind's green-700 */
                }
                .table tr:hover {
                  background-color: #f9fafb;
                }
            `}</style>
        </div>
    );
};

export default AdminHome;
