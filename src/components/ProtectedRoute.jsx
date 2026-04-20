import { Navigate } from "react-router-dom";

function protectedRoute({ isLoggedIn, children }) {
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  } else {
    return children;
  }
}

export default protectedRoute;