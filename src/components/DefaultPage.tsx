import LeftMenu from "./LeftMenu";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function DefaultPage() {
  const navigate = useNavigate();
  useEffect(() => {
    const userId = localStorage.getItem("connectedUser");
    if (!userId) {
      navigate(`/login`);
    }
  }, [navigate]);
  return (
    <div>
      <LeftMenu />
    </div>
  );
}

export default DefaultPage;
