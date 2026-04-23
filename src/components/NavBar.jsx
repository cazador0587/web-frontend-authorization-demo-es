// Nueva importación - useNavigate
// Nueva importación - useContext
import { useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";

// Nueva importación
import AppContext from "../contexts/AppContext";
import { removeToken } from "../utils/token";
import Logo from "./Logo";
import "./styles/NavBar.css";

// Especificar setIsLoggedIn como una propiedad. ¡No olvides pasar
// setIsLoggedIn como una propiedad del componente App!
function NavBar() {
  // Invocar el hook.
  const navigate = useNavigate();
  const { setIsLoggedIn } = useContext(AppContext);


  // La función signOut elimina el token del almacenamiento
  // local, los envía de vuelta a la página de inicio de sesión, y
  // establece isLoggedIn como falso.
 function signOut() {
   removeToken();
   navigate("/login");
   setIsLoggedIn(false);
  }
  
  return (
    <div className="navbar">
      <div className="navbar__logo">
        <Logo />
      </div>
      <ul className="navbar__nav">
        <li>
          <NavLink to="/ducks" className="navbar__link">
            Patos
          </NavLink>
        </li>
        <li>
          <NavLink to="/my-profile" className="navbar__link">
            Mi perfil
          </NavLink>
        </li>
        {/* ... */}
        {/* Añade el detector onClick. */}
        <li>
          <button className="navbar__link navbar__button" onClick={signOut}>
            Cerrar sesión
          </button>
        </li>
      </ul>
    </div>
  );
}

export default NavBar;
