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
      <div className="flex items-center justify-between p-4 max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-full overflow-hidden bg-[#333333]">
              {profilePicture ? (
                <img
                  src={profilePicture}
                  alt={`Photo de profil de ${username}`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-white">
                  {username.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            <div
              className={`absolute -right-0.5 -bottom-0.5 w-3 h-3 rounded-full border-2 border-[#222222] ${
                isOnline ? "bg-green-500" : "bg-gray-500"
              }`}
            />
          </div>
          <div className="flex flex-col">
            <span className="text-white font-medium">{username}</span>
            <span className="text-green-400 text-sm">
              {isOnline ? "En ligne" : "Hors ligne"}
            </span>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-4 py-2 text-white hover:bg-[#333333] rounded-full transition-colors"
          title="Se déconnecter"
          aria-label="Se déconnecter"
        >
          <LogOut className="w-5 h-5" />
          <span>Déconnexion</span>
        </button>
      </div>
      {error && (
        <div className="bg-red-500/50 text-white p-2 text-center">{error}</div>
      )}
    </div>
  );
}

export default TopMenu;
