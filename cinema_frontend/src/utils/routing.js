import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const useRoleBasedRedirect = (userData, navigate) => {

  useEffect(() => {
    if (userData) {
      switch (userData.role) {
        case "admin":
          navigate("/admin");
          break;
        case "moderator":
          navigate("/moderator");
          break;
        case "user":
          navigate("/customer");
          break;
        default:
          navigate("/login");
      }
    }
  }, [userData, navigate]);
};

export default useRoleBasedRedirect;
