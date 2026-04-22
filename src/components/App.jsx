/* eslint-disable no-undef */
import{ useState, useEffect } from "react";
import { Routes, Route, Navigate, useNavigate, useLocation } from "react-router-dom";
import Ducks from "./Ducks";
import Login from "./Login";
import MyProfile from "./MyProfile";
import Register from "./Register";
import ProtectedRoute from "./ProtectedRoute";
import * as auth from "../utils/auth";
import * as api from "../utils/api";
import { setToken, getToken } from "../utils/token";
import "./styles/App.css";

function App() {
  // eslint-disable-next-line no-unused-vars
  // Nueva variable de estado: userData
  const [userData, setUserData] = useState({ username: "", email: "" });
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

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

const handleLogin = ({ username, password }) => {
  if (!username || !password) {
    return;
  }

  auth
    .authorize(username, password)
    .then((data) => {
      // Verifica que se incluyó un jwt antes de iniciar la sesión del usuario.
      if (data.jwt) {
        // Guarda el token en el almacenamiento local
        setToken(data.jwt);
        setUserData(data.user); // guardar los datos de usuario en el estado
        setIsLoggedIn(true); // inicia la sesión del usuario

        // Después de iniciar sesión, en lugar de navegar todo el tiempo a /ducks,
        // navega a la ubicación que se almacena en state. Si
        // no hay ubicación almacenada, por defecto
        // redirigimos a /ducks.
        const redirectPath = location.state?.from?.pathname || "/ducks";
        navigate(redirectPath);

        //navigate("/ducks"); // enviarlo a /ducks
      }
    })
    .catch(console.error);
};

  useEffect(() => {
    const jwt = getToken();

    if (!jwt) {
      return;
    }

    // Llama a la función, pasándole el JWT.
    api
      .getUserInfo(jwt)
      .then(({ username, email }) => {
        // si la respuesta es exitosa, inicia la sesión del usuario, guarda sus
        // datos en el estado y lo dirige a /ducks.
        setIsLoggedIn(true);
        setUserData({ username, email });
        //navigate("/ducks");
      })
      .catch(console.error);
  }, []);

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
            <MyProfile userData={userData} />
          </ProtectedRoute>
        }
      />
      {/* Envuelve la ruta /login en una ProtectedRoute. Asegúrate de
      especificar la prop anoymous, para redirigir a los usuarios conectados
      a "/". */}
      <Route
        path="/login"
        element={
          <ProtectedRoute isLoggedIn={isLoggedIn} anonymous>
            <div className="loginContainer">
              <Login handleLogin={handleLogin} />
            </div>
          </ProtectedRoute>
        }
      />
      {/* Envuelve la ruta /register en una ProtectedRoute. Asegúrate de
      especificar la prop anoymous, para redirigir a los usuarios conectados
      a "/". */}
      <Route
        path="/register"
        element={
          <ProtectedRoute isLoggedIn={isLoggedIn} anonymous>
            <div className="registerContainer">
              <Register handleRegistration={handleRegistration} />
            </div>
          </ProtectedRoute>
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
    </Routes>
  );
}

export default App;
