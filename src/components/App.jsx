import{ useState } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import Ducks from "./Ducks";
import Login from "./Login";
import MyProfile from "./MyProfile";
import Register from "./Register";
import ProtectedRoute from "./ProtectedRoute";
import * as auth from "../utils/auth";
import "./styles/App.css";

function App() {
  // eslint-disable-next-line no-unused-vars
  // Nueva variable de estado: userData
  const [userData, setUserData] = useState({ username: "", email: "" });
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const navigate = useNavigate();

  const handleLogin = ({ username, password }) => {
    if (!username || !password) {
      return;
    }

  const handleRegistration = ({
    username,
    email,
    password,
    confirmPassword,
  }) => {
    if (password === confirmPassword) {
      auth
        .register(username, email, password)
        .then(() => {
          console.log("Registration successful!");
          navigate("/login");
        })
        .catch(console.error);
    }
  };

  // handleLogin acepta un parámetro: un objeto con dos propiedades.
  const handleLogin = ({ username, password }) => {
    // si el nombre de usuario o la contraseña están vacíos, no se envía la solicitud.
    if (!username || !password) {
      return;
    }

  return (
    <Routes>
      <Route
        path="/ducks"
        element={
          <ProtectedRoute isLoggedIn={isLoggedIn}>
            <Ducks />
          </ProtectedRoute>
        }
      />
      <Route
        path="/my-profile"
        element={
          <ProtectedRoute isLoggedIn={isLoggedIn}>
            <MyProfile />
          </ProtectedRoute>
        }
      />
      <Route
        path="/login"
        element={
          <div className="loginContainer">
            <Login />
          </div>
        }
      />
      <Route
        path="/register"
        element={
          <div className="registerContainer">
            <Register handleRegistration={handleRegistration} />
          </div>
        }
      />
      <Route
        path="*"
        element={
          isLoggedIn ? (
            <Navigate to="/ducks" replace />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
      {/* Pasa el controlador al componente Login. */}
      <Route
        path="/login"
        element={
          <div className="loginContainer">
            <Login handleLogin={handleLogin} />
          </div>
        }
      />
    </Routes>
  );
}

export default App;
