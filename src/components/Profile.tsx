import { useEffect } from "react";
import { logout } from "../services/api";
import { useNavigate } from "react-router-dom";

function Profile() {
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate(`/login`);
  };
  useEffect(() => {
    const userId = localStorage.getItem("connectedUser");
    if (!userId) {
      navigate(`/login`); // temporaire pour faciliter le développement
    }
  }, [navigate]);

  return (
    <div>
      <h1>Profile</h1>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}

export default Profile;

