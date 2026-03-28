/** biome-ignore-all assist/source/organizeImports: <> */
import { Navigate } from "react-router-dom";
import { AuthenticationContext } from "../../Context/Authentication";
import { useContext } from "react";

export default function ProtectedRoute({ children }) {

  const { token } = useContext(AuthenticationContext);

  if (token === null) {
    return <Navigate to="/login" />
  }

  return <>

    {children}

  </>
}
