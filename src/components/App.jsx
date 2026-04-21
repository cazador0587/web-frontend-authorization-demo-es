import{ useState } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
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
        navigate("/ducks"); // enviarlo a /ducks
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
        navigate("/ducks");
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
            <MyProfile userData={userData}/>
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
        path="*"
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
