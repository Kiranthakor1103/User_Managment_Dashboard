import React, { useEffect, useState } from "react";
import { getUsers, deleteUser } from "../services/api";
import UserModal from "./UserModal";
import { FiEdit, FiTrash2, FiPlus } from "react-icons/fi";
import { Avatar, IconButton, Tooltip } from "@mui/material";

const AVATAR_COLORS = [
  "#EF4444",
  "#F59E0B",
  "#10B981",
  "#3B82F6",
  "#8B5CF6",
  "#EC4899",
];

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const perPage = 10;

  const fetchData = async () => {
    setIsLoading(true);
    const data = await getUsers();
    setUsers(data);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredUsers = users.filter((u) => {
    const searchTerm = search.toLowerCase();
    return (
      u.name?.toLowerCase().includes(searchTerm) ||
      u.email?.toLowerCase().includes(searchTerm) ||
      u.location?.toLowerCase().includes(searchTerm) ||
      u.age?.toString().includes(searchTerm) ||
      (u.createdAt &&
        new Date(u.createdAt).toLocaleDateString().includes(searchTerm))
    );
  });

  const paginatedUsers = filteredUsers.slice(
    (page - 1) * perPage,
    page * perPage
  );
  const totalPages = Math.ceil(filteredUsers.length / perPage);

  const handleEdit = (user) => {
    setSelectedUser(user);
    setOpenModal(true);
  };

  const handleDeleteConfirmation = (id) => {
    setUserToDelete(id);
    setOpenDeleteDialog(true);
  };

  const handleDelete = async () => {
    if (userToDelete) {
      await deleteUser(userToDelete);
      fetchData();
      setOpenDeleteDialog(false);
      setUserToDelete(null);
    }
  };

  const getAvatarColor = (name) =>
    AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length];

  return (
    <div className="p-4 sm:p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-gray-800">
        User Management
      </h1>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-4 sm:mb-6 items-center w-full">
        <button
          className="flex items-center justify-center w-full sm:w-auto bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-4 py-2 rounded-xl shadow hover:from-purple-500 hover:to-indigo-500 transition transform hover:scale-105"
          onClick={() => {
            setSelectedUser(null);
            setOpenModal(true);
          }}
        >
          <FiPlus className="mr-2" /> Create User
        </button>
        <input
          type="text"
          placeholder="Search by name, email, location, age, date"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 w-full sm:w-auto"
        />
      </div>

      {/* User Table */}
      {isLoading ? (
        <div className="flex justify-center py-20">
          <div className="loader border-4 border-indigo-500 border-t-transparent rounded-full w-12 h-12 animate-spin"></div>
        </div>
      ) : (
        <div className="overflow-x-auto bg-white rounded-2xl shadow-lg">
          <table className="min-w-full divide-y divide-gray-200 text-sm sm:text-base">
            <thead className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
              <tr>
                {[
                  "Avatar",
                  "Name",
                  "Email",
                  "Location",
                  "Age",
                  "Created At",
                  "Actions",
                ].map((col) => (
                  <th
                    key={col}
                    className="px-2 sm:px-4 py-2 sm:py-3 text-left font-semibold uppercase tracking-wider"
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedUsers.map((user) => (
                <tr
                  key={user.id}
                  className="hover:bg-indigo-50 transition cursor-pointer"
                  onClick={(e) => {
                    if (e.target.closest("button")) return;
                    handleEdit(user);
                  }}
                >
                  <td className="px-2 sm:px-4 py-2">
                    {user.avatar ? (
                      <Avatar
                        src={user.avatar}
                        alt={user.name}
                        className="w-8 h-8 sm:w-10 sm:h-10"
                      />
                    ) : (
                      <Avatar
                        sx={{
                          bgcolor: getAvatarColor(user.name),
                          width: 32,
                          height: 32,
                          fontSize: 14,
                          sm: { width: 40, height: 40, fontSize: 16 },
                        }}
                      >
                        {user.name.charAt(0).toUpperCase()}
                      </Avatar>
                    )}
                  </td>
                  <td className="px-2 sm:px-4 py-2 font-medium">{user.name}</td>
                  <td className="px-2 sm:px-4 py-2 text-gray-600 truncate max-w-[120px] sm:max-w-[200px]">
                    {user.email || "-"}
                  </td>
                  <td className="px-2 sm:px-4 py-2 text-gray-600 truncate max-w-[100px] sm:max-w-[150px]">
                    {user.location || "-"}
                  </td>
                  <td className="px-2 sm:px-4 py-2 text-gray-600">
                    {user.age || "-"}
                  </td>
                  <td className="px-2 sm:px-4 py-2 text-gray-600">
                    {user.createdAt
                      ? new Date(user.createdAt).toLocaleDateString()
                      : "-"}
                  </td>
                  <td className="px-2 sm:px-4 py-2 flex gap-1 sm:gap-2">
                    <Tooltip title="Edit">
                      <IconButton
                        onClick={() => handleEdit(user)}
                        className="bg-yellow-400 hover:bg-yellow-500 text-white p-1 rounded-lg"
                        size="small"
                      >
                        <FiEdit />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton
                        onClick={() => handleDeleteConfirmation(user.id)}
                        className="bg-red-500 hover:bg-red-600 text-white p-1 rounded-lg"
                        size="small"
                      >
                        <FiTrash2 />
                      </IconButton>
                    </Tooltip>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      <div className="flex justify-center mt-4 sm:mt-6 flex-wrap gap-2">
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            onClick={() => setPage(i + 1)}
            className={`px-3 sm:px-4 py-1 sm:py-2 text-sm sm:text-base font-medium rounded-lg transition-all duration-200 ${
              page === i + 1
                ? "bg-indigo-600 text-white shadow-lg transform scale-105"
                : "bg-white border border-gray-300 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600"
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>

      {/* User Modal */}
      {openModal && (
        <UserModal
          open={openModal}
          handleClose={() => setOpenModal(false)}
          user={selectedUser}
          refresh={fetchData}
        />
      )}

      {/* Delete Confirmation */}
      {openDeleteDialog && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
          <div className="bg-white p-4 sm:p-6 rounded-xl shadow-lg max-w-sm w-full">
            <h2 className="text-lg sm:text-xl font-bold mb-2 sm:mb-4">
              Confirm Deletion
            </h2>
            <p className="mb-4 sm:mb-6 text-sm sm:text-base">
              Are you sure you want to delete this user? This action cannot be
              undone.
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setOpenDeleteDialog(false)}
                className="px-3 py-1 sm:px-4 sm:py-2 bg-gray-300 rounded-lg hover:bg-gray-400 transition text-sm sm:text-base"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-3 py-1 sm:px-4 sm:py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition text-sm sm:text-base"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserList;
