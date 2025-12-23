import { useState, useEffect } from "react";

export const useAuth = () => {
  const [error, setError] = useState(null);

  const login = async ({ email, password }) => {
    try {
      const response = await fetch("http://localhost:5555/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.error || "Login failed");
        return;
      }

      const data = await response.json();
      localStorage.setItem("token", data.token);
      window.location.href = "/"; // Redirect to dashboard
    } catch {
      setError("Không thể kết nối đến máy chủ. Vui lòng thử lại sau.");
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  const checkToken = () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const decoded = JSON.parse(atob(token.split(".")[1]));
      const currentTime = Date.now() / 1000;
      if (decoded.exp < currentTime) {
        logout();
      }
    } catch (error) {
      console.error("Error decoding token", error);
      logout();
    }
  };

  useEffect(() => {
    checkToken();

    const interval = setInterval(checkToken, 60000);

    return () => clearInterval(interval);
  }, []);

  return { login, logout, error };
};
