import React, { useState, useEffect } from "react";
import { createUser, updateUser } from "../services/api";

const UserModal = ({ open, handleClose, user, refresh }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    avatar: "",
    gender: "",
    location: "",
    age: "",
  });

  const [isChanged, setIsChanged] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        avatar: user.avatar || "",
        gender: user.gender || "",
        location: user.location || "",
        age: user.age || "",
      });
    } else {
      setFormData({
        name: "",
        email: "",
        avatar: "",
        gender: "",
        location: "",
        age: "",
      });
    }
    setIsChanged(false);
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setIsChanged(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isChanged) {
      handleClose();
      return;
    }

    if (user) {
      const hasChanges = Object.keys(formData).some(
        (key) => formData[key] !== (user[key] || "")
      );
      if (hasChanges) await updateUser(user.id, formData);
    } else {
      await createUser(formData);
    }
    refresh();
    handleClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 transform transition-all duration-300 scale-95 hover:scale-100">
        {/* Gradient Header */}
        <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent mb-6 text-center">
          {user ? "Edit User" : "Create User"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Floating Input fields */}
          {[
            { name: "name", placeholder: "Name", type: "text", required: true },
            { name: "email", placeholder: "Email", type: "email" },
            { name: "avatar", placeholder: "Avatar URL", type: "text" },
            { name: "location", placeholder: "Location", type: "text" },
            { name: "age", placeholder: "Age", type: "number" },
          ].map((field) => (
            <input
              key={field.name}
              type={field.type}
              name={field.name}
              placeholder={field.placeholder}
              value={formData[field.name]}
              onChange={handleChange}
              required={field.required}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-indigo-400 focus:outline-none transition duration-300 hover:scale-105"
            />
          ))}

          {/* Gender select */}
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-indigo-400 focus:outline-none transition duration-300 hover:scale-105"
          >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>

          {/* Buttons */}
          <div className="flex justify-end gap-3 mt-4">
            <button
              type="button"
              onClick={handleClose}
              className="px-5 py-2 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition duration-300 transform hover:scale-105"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white rounded-xl shadow-lg hover:from-pink-500 hover:to-indigo-500 transition duration-300 transform hover:scale-105"
            >
              {user ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserModal;
