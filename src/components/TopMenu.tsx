import React, { useState } from "react";

import { logOut } from "../services/api";

import { LogOut } from "lucide-react";

import { useNavigate } from "react-router-dom";

interface User {
  id: string;

  username: string;

  isOnline: boolean;

  profilePicture?: string;
}

interface TopMenuProps {
  user: User;
}

function TopMenu({ user }: TopMenuProps) {
  const { username, isOnline, profilePicture } = user;

  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logOut();

      navigate("/login");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Erreur lors de la déconnexion.");
      }
    }
  };

  return (
    <div className="bg-[#222222] border-b border-gray-800">
      <div className="flex items-center justify-between p-2 sm:p-4 max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="relative">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full overflow-hidden bg-[#333333]">
              {profilePicture ? (
                <img
                  src={profilePicture}
                  alt={`Photo de profil de ${username}`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-white text-sm sm:text-base">
                  {username.charAt(0).toUpperCase()}
                </div>
              )}
            </div>

            <div
              className={`absolute -right-0.5 -bottom-0.5 w-2 h-2 sm:w-3 sm:h-3 rounded-full border-2 border-[#222222] ${
                isOnline ? "bg-green-500" : "bg-gray-500"
              }`}
            />
          </div>

          <div className="flex flex-col">
            <span className="text-white font-medium text-sm sm:text-base">
              {username}
            </span>

            <span className="text-green-400 text-xs sm:text-sm">
              {isOnline ? "En ligne" : "Hors ligne"}
            </span>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-1.5 sm:py-2 text-white hover:bg-[#333333] rounded-full transition-colors"
          title="Se déconnecter"
          aria-label="Se déconnecter"
        >
          <LogOut className="w-4 h-4 sm:w-5 sm:h-5" />

          <span className="hidden sm:inline">Déconnexion</span>
        </button>
      </div>

      {error && (
        <div className="bg-red-500/50 text-white p-2 text-sm sm:text-base text-center">
          {error}
        </div>
      )}
    </div>
  );
}

export default TopMenu;
