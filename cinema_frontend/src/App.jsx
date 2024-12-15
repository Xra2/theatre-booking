import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import LoginPage from "./Components/LoginPage";
import SignupPage from "./Components/SignupPage";
import AdminPage from "./Components/AdminPage";
import ModeratorPage from "./Components/ModeratorPage";
import CustomerPage from "./Components/CustomerPage";  // Import CustomerPage
import useRoleBasedRedirect from "./utils/routing";

const App = () => {
  const [userData, setUserData] = useState(null); // Store user data, including access token

  // Handle login (store user data, including role and access token)
  const onLogin = (userData) => {
    setUserData(userData);
  };

  // Handle logout
  const handleLogout = () => {
    setUserData(null); // Clear user data on logout
  };


  // ProtectedRoute component to restrict access based on role
  const ProtectedRoute = ({ children, allowedRoles }) => {
    if (!userData || !allowedRoles.includes(userData.roles)) {
      return <Navigate to="/login" replace />;
    }
    return children;
  };

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage onLogin={onLogin} userData={userData} />} />
        <Route path="/signup" element={<SignupPage />} />
        
        {/* Protected Routes for Admin, Moderator, and Customer */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminPage userData={userData} onLogout={handleLogout} />
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/moderator"
          element={
            <ProtectedRoute allowedRoles={["moderator"]}>
              <ModeratorPage userData={userData} onLogout={handleLogout} />
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/customer"
          element={
            <ProtectedRoute allowedRoles={["user"]}>
              <CustomerPage userData={userData} onLogout={handleLogout} />
            </ProtectedRoute>
          }
        />
        
        {/* Redirect default to login */}
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
};

export default App;
