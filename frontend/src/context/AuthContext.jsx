import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(undefined);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load all users and active session on mount
  useEffect(() => {
    try {
      const storedUsers = localStorage.getItem("solosync-users");
      if (storedUsers) {
        setUsers(JSON.parse(storedUsers));
      }

      const storedSession = localStorage.getItem("solosync-session");
      if (storedSession) {
        setUser(JSON.parse(storedSession));
      }
    } catch (error) {
      console.error("Error loading auth data from localStorage:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Helper to persist users list
  const saveUsers = (updatedUsers) => {
    setUsers(updatedUsers);
    localStorage.setItem("solosync-users", JSON.stringify(updatedUsers));
  };

  const signup = (username, email, password, avatarId) => {
    // Check if email already exists
    const emailExists = users.some((u) => u.email.toLowerCase() === email.toLowerCase());
    if (emailExists) {
      return { success: false, error: "An account with this email already exists." };
    }

    // Check if username already exists
    const usernameExists = users.some((u) => u.username.toLowerCase() === username.toLowerCase());
    if (usernameExists) {
      return { success: false, error: "Username is already taken." };
    }

    const newUser = {
      id: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 11),
      username,
      email,
      password, // In a real app, this would be hashed on the backend
      avatarId,
    };

    const updatedUsers = [...users, newUser];
    saveUsers(updatedUsers);

    // Automatically log in the user
    setUser(newUser);
    localStorage.setItem("solosync-session", JSON.stringify(newUser));

    return { success: true };
  };

  const login = (email, password) => {
    const foundUser = users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );

    if (!foundUser) {
      return { success: false, error: "Invalid email or password." };
    }

    setUser(foundUser);
    localStorage.setItem("solosync-session", JSON.stringify(foundUser));
    return { success: true };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("solosync-session");
  };

  const updateAvatar = (avatarId) => {
    if (!user) return { success: false };
    const updatedUser = { ...user, avatarId };
    setUser(updatedUser);
    localStorage.setItem("solosync-session", JSON.stringify(updatedUser));

    const updatedUsers = users.map((u) => (u.id === user.id ? updatedUser : u));
    saveUsers(updatedUsers);
    return { success: true };
  };

  return (
    <AuthContext.Provider value={{ user, users, isLoading, signup, login, logout, updateAvatar }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
