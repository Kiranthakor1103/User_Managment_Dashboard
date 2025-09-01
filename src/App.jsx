import React, { useState, useEffect } from "react";
import { getUsers, deleteUser } from "./services/api";
import UserModal from "./components/UserModal";
import Dashboard from "./components/Dashboard";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Tabs,
  Tab,
  Box,
  TextField,
  IconButton,
  Avatar,
  Tooltip,
} from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";

const AVATAR_COLORS = [
  "#EF4444",
  "#F59E0B",
  "#10B981",
  "#3B82F6",
  "#8B5CF6",
  "#EC4899",
];

const App = () => {
  const [users, setUsers] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [tab, setTab] = useState(0);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [sortKey, setSortKey] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");

  const fetchUsers = async () => {
    const data = await getUsers();
    setUsers(data);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleOpenModal = (user = null) => {
    setSelectedUser(user);
    setOpenModal(true);
  };

  const handleDelete = async (id) => {
    await deleteUser(id);
    fetchUsers();
  };

  const filteredUsers = users
    .filter(
      (user) =>
        user.name?.toLowerCase().includes(search.toLowerCase()) ||
        user.email?.toLowerCase().includes(search.toLowerCase()) ||
        user.location?.toLowerCase().includes(search.toLowerCase()) ||
        user.age?.toString().includes(search) ||
        (user.createdAt &&
          new Date(user.createdAt).toLocaleDateString().includes(search))
    )
    .sort((a, b) => {
      if (!a[sortKey]) return 1;
      if (!b[sortKey]) return -1;
      if (sortOrder === "asc") return a[sortKey] > b[sortKey] ? 1 : -1;
      return a[sortKey] < b[sortKey] ? 1 : -1;
    });

  const getAvatarColor = (name) =>
    AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* App Bar */}
      <AppBar
        position="static"
        className="bg-gradient-to-r from-indigo-600 to-purple-600"
      >
        <Toolbar>
          <Typography variant="h6" className="flex-grow text-sm sm:text-base">
            User Management Dashboard
          </Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" className="mt-6 sm:mt-8">
        {/* Tabs */}
        <Tabs
          value={tab}
          onChange={(e, v) => setTab(v)}
          className="bg-white rounded-lg shadow"
          variant="fullWidth"
        >
          <Tab label="Dashboard" />
          <Tab label="Users List" />
        </Tabs>

        <Box mt={4}>
          {/* Dashboard Tab */}
          {tab === 0 && <Dashboard users={users} />}

          {/* Users List Tab */}
          {tab === 1 && (
            <Box>
              {/* Controls */}
              <div className="flex flex-col md:flex-row gap-3 mb-4 items-center w-full">
                <TextField
                  label="Search..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  size="small"
                  variant="outlined"
                  className="flex-1 w-full md:w-auto"
                />
                <Button
                  variant="contained"
                  className="w-full md:w-auto bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-purple-500 hover:to-indigo-500"
                  onClick={() => handleOpenModal()}
                >
                  Add User
                </Button>
              </div>

              {/* Table */}
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
                          className="px-2 sm:px-4 py-2 text-left font-semibold uppercase tracking-wider"
                        >
                          {col}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredUsers
                      .slice(
                        page * rowsPerPage,
                        page * rowsPerPage + rowsPerPage
                      )
                      .map((user) => (
                        <tr
                          key={user.id}
                          className="hover:bg-indigo-50 transition"
                        >
                          <td className="px-2 sm:px-4 py-2">
                            {user.avatar ? (
                              <Avatar
                                src={user.avatar}
                                alt={user.name}
                                sx={{
                                  width: 32,
                                  height: 32,
                                  sm: { width: 40, height: 40 },
                                }}
                              />
                            ) : (
                              <Avatar
                                sx={{
                                  bgcolor: getAvatarColor(user.name),
                                  width: 32,
                                  height: 32,
                                  sm: { width: 40, height: 40 },
                                }}
                              >
                                {user.name.charAt(0).toUpperCase()}
                              </Avatar>
                            )}
                          </td>
                          <td className="px-2 sm:px-4 py-2 font-medium">
                            {user.name}
                          </td>
                          <td className="px-2 sm:px-4 py-2 truncate max-w-[120px] sm:max-w-[200px]">
                            {user.email || "-"}
                          </td>
                          <td className="px-2 sm:px-4 py-2 truncate max-w-[100px] sm:max-w-[150px]">
                            {user.location || "-"}
                          </td>
                          <td className="px-2 sm:px-4 py-2">
                            {user.age || "-"}
                          </td>
                          <td className="px-2 sm:px-4 py-2">
                            {user.createdAt
                              ? new Date(user.createdAt).toLocaleDateString()
                              : "-"}
                          </td>
                          <td className="px-2 sm:px-4 py-2 flex gap-1 sm:gap-2">
                            <Tooltip title="Edit">
                              <IconButton
                                onClick={() => handleOpenModal(user)}
                                className="bg-yellow-400 hover:bg-yellow-500 text-white p-1 rounded-lg"
                                size="small"
                              >
                                <Edit />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Delete">
                              <IconButton
                                onClick={() => handleDelete(user.id)}
                                className="bg-red-500 hover:bg-red-600 text-white p-1 rounded-lg"
                                size="small"
                              >
                                <Delete />
                              </IconButton>
                            </Tooltip>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="flex flex-col sm:flex-row justify-between items-center mt-4 gap-2">
                <TextField
                  select
                  label="Rows per page"
                  value={rowsPerPage}
                  onChange={(e) => setRowsPerPage(parseInt(e.target.value))}
                  SelectProps={{ native: true }}
                  size="small"
                  className="w-full sm:w-40 md:w-32 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-lg shadow-md focus-within:ring-2 focus-within:ring-indigo-400 transition-all duration-300 hover:from-indigo-200 hover:to-purple-200"
                  InputProps={{
                    className:
                      "text-sm sm:text-base font-semibold text-gray-900", // extra font weight
                  }}
                >
                  {[5, 10, 25, 50].map((num) => (
                    <option
                      key={num}
                      value={num}
                      className="bg-white text-gray-900 font-semibold hover:bg-indigo-100"
                    >
                      {num}
                    </option>
                  ))}
                </TextField>

                <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                  {Array.from(
                    { length: Math.ceil(filteredUsers.length / rowsPerPage) },
                    (_, i) => (
                      <button
                        key={i}
                        className={`px-3 py-1 rounded-lg ${
                          page === i
                            ? "bg-indigo-500 text-white"
                            : "bg-white border border-gray-300 text-gray-700 hover:bg-indigo-50"
                        }`}
                        onClick={() => setPage(i)}
                      >
                        {i + 1}
                      </button>
                    )
                  )}
                </div>
              </div>
            </Box>
          )}
        </Box>
      </Container>

      {/* User Modal */}
      <UserModal
        open={openModal}
        handleClose={() => setOpenModal(false)}
        user={selectedUser}
        refresh={fetchUsers}
      />
    </div>
  );
};

export default App;
