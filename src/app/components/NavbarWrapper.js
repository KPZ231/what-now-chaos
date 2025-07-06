"use client";

import { useState } from "react";
import Navbar from "@/app/partial/navbar";
import { useAuth } from "@/lib/AuthContext";

export default function NavbarWrapper({ children }) {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { user, isLoading, isAuthenticated, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    setShowUserMenu(false);
  };

  return (
    <>
      <Navbar
        isLoading={isLoading}
        isAuthenticated={isAuthenticated}
        user={user}
        showUserMenu={showUserMenu}
        setShowUserMenu={setShowUserMenu}
        handleLogout={handleLogout}
      />
      {children}
    </>
  );
} 