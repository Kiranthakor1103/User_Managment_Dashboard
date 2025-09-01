import React, { useEffect, useState } from "react";
import { getUsers } from "../services/api";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";

// Vibrant color palette for charts and avatars
const COLORS = [
  "#4F46E5",
  "#F43F5E",
  "#F59E0B",
  "#10B981",
  "#3B82F6",
  "#8B5CF6",
];
const AVATAR_COLORS = [
  "#EF4444",
  "#F59E0B",
  "#10B981",
  "#3B82F6",
  "#8B5CF6",
  "#EC4899",
];

const Dashboard = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getUsers();
      setUsers(data);
    };
    fetchData();
  }, []);

  const totalUsers = users.length;

  // Users per day last 30 days
  const last30Days = Array.from({ length: 30 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - i);
    return date.toISOString().split("T")[0];
  }).reverse();

  const usersPerDay = last30Days.map((date) => ({
    date,
    count: users.filter((u) => u.createdAt && u.createdAt.startsWith(date))
      .length,
  }));

  // Avatar distribution
  const avatarData = [
    { name: "Has Avatar", value: users.filter((u) => u.avatar).length },
    { name: "No Avatar", value: users.filter((u) => !u.avatar).length },
  ];

  // Signup hour distribution
  const hoursData = Array.from({ length: 24 }, (_, i) => ({
    hour: i,
    count: users.filter(
      (u) => u.createdAt && new Date(u.createdAt).getHours() === i
    ).length,
  }));

  // Recently joined users
  const recentUsers = [...users]
    .filter((u) => u.createdAt)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  // Helper function to get random color for avatar fallback
  const getRandomColor = (name) => {
    const index = name.charCodeAt(0) % AVATAR_COLORS.length;
    return AVATAR_COLORS[index];
  };

  return (
    <div className="p-6 bg-gradient-to-r from-gray-100 via-gray-50 to-gray-100 min-h-screen">
      <h1 className="text-4xl font-bold text-gray-800 mb-8">User Dashboard</h1>

      {/* Total Users */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-xl rounded-3xl p-8 mb-8 text-center hover:scale-105 transition-transform duration-300">
        <h2 className="text-2xl font-semibold mb-2">Total Users</h2>
        <p className="text-5xl font-bold">{totalUsers}</p>
      </div>

      {/* Charts Section */}
      <div className="grid md:grid-cols-2 gap-8 mb-8">
        {/* Users per day */}
        <div className="bg-white rounded-3xl shadow-xl p-6 hover:shadow-2xl transition-shadow duration-300">
          <h3 className="text-xl font-semibold text-indigo-600 mb-4">
            Users Created Per Day
          </h3>
          <div className="w-full h-64 md:h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={usersPerDay}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke="#4F46E5"
                  strokeWidth={3}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Avatar distribution */}
        <div className="bg-white rounded-3xl shadow-xl p-6 hover:shadow-2xl transition-shadow duration-300">
          <h3 className="text-xl font-semibold text-indigo-600 mb-4">
            Avatar Distribution
          </h3>
          <div className="w-full h-64 md:h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={avatarData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label
                >
                  {avatarData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Signup Hour Distribution */}
      <div className="bg-white rounded-3xl shadow-xl p-6 mb-8 hover:shadow-2xl transition-shadow duration-300">
        <h3 className="text-xl font-semibold text-indigo-600 mb-4">
          Signup Time of Day Distribution
        </h3>
        <div className="w-full h-64 md:h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={hoursData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="hour"
                tick={{ fontSize: 12 }}
                label={{
                  value: "Hour",
                  position: "insideBottomRight",
                  offset: 0,
                }}
              />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="count"
                stroke="#F43F5E"
                strokeWidth={3}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recently Joined Users */}
      <div className="bg-white rounded-3xl shadow-xl p-6 hover:shadow-2xl transition-shadow duration-300">
        <h3 className="text-xl font-semibold text-indigo-600 mb-4">
          Recently Joined Users
        </h3>
        <div className="flex gap-6 overflow-x-auto py-2">
          {recentUsers.map((user) => (
            <div
              key={user.id}
              className="flex flex-col items-center flex-shrink-0 w-24 hover:scale-110 transition-transform duration-300"
            >
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-16 h-16 rounded-full border-2 border-indigo-400 object-cover"
                />
              ) : (
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-xl border-2"
                  style={{
                    backgroundColor: getRandomColor(user.name),
                    borderColor: "#fff",
                  }}
                >
                  {user.name.charAt(0).toUpperCase()}
                </div>
              )}
              <p className="mt-2 text-sm font-medium text-gray-700 text-center">
                {user.name}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
