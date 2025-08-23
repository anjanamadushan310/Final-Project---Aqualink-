import { useState } from "react";



export default function useAuth() {
  const stored = JSON.parse(localStorage.getItem("user"));
  const [user, setUser] = useState(stored);
  

  function login(data) {
    setUser(data);
    localStorage.setItem("user", JSON.stringify(data));
  }
  function logout() {
    setUser(null);
    localStorage.removeItem("user");
  

  }
  return { user, login, logout };
}