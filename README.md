# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

# User Management Dashboard

A responsive **User Management Dashboard** built with **React**, **Material-UI**, and **Tailwind CSS**. This project allows you to manage users with features like adding, editing, deleting, searching, pagination, and sorting. It also includes a **Dashboard view** with key user statistics.

## Table of Contents
- [Demo](#demo)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Usage](#usage)
- [Folder Structure](#folder-structure)
- [Contributing](#contributing)
- [License](#license)

## Demo

You can add a live demo link here (Netlify link).  
Link:- https://usermanagementdash-board.netlify.app
---

## Features

### Dashboard
- Overview of users with metrics and visual charts.
- Quick insights into user statistics.

### Users List
- Add User: Create new users with name, email, location, age, and avatar.  
- Edit User: Update user details quickly.  
- Delete User: Remove users with confirmation dialog.  
- Search: Search by name, email, location, age, or created date.  
- Pagination: Navigate large user lists easily.  
- Rows per page selector: Choose how many users to display per page.  
- Sorting: Sort users by name and email.

### Responsive Design
- Fully responsive layout for mobile, tablet, and desktop screens.
- Mobile-friendly table with truncation and card-like feel for readability.  

### UI/UX Enhancements
- Gradient backgrounds and hover effects on buttons and fields.
- Bolder fonts for better readability.
- Smooth transitions and focus indicators for inputs.

## Tech Stack

- Frontend: React.js, Tailwind CSS, Material-UI (MUI)
- State Management: React Hooks (`useState`, `useEffect`)
- Icons: Material-UI Icons
- HTTP Requests: Axios (via `getUsers` and `deleteUser` API services)
- Backend: Mock API / JSON Server / Your API

## Installation

1. Make sure you have Node.js installed.  
2. Open your project folder in terminal.  
3. Install dependencies:

```bash
npm install
