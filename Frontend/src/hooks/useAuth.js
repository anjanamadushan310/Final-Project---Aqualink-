import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function useAuth() {
  const stored = JSON.parse(localStorage.getItem("user"));
  const [user, setUser] = useState(stored);
  

  function login(data,navigate) {
    setUser(data);
    localStorage.setItem("user", JSON.stringify(data));
    
    // Auto redirect to first dashboard after login
    if (data.roles && data.roles.length > 0) {
      const firstRole = data.roles[0];
      const dashboardPath = firstRole.toLowerCase().replace(/_/g, '-');
      navigate(`/dashboard/${dashboardPath}`);
    }
  }
  
  function logout() {
    setUser(null);
    localStorage.removeItem("token"); // Remove token on logout

    //localStorage.removeItem("user");
  }
  
  return { user, login, logout };
}
