/** biome-ignore-all assist/source/organizeImports: <> */
import { Navigate, useLocation } from "react-router-dom"
import { AuthenticationContext } from "../../Context/Authentication"
import { useContext } from "react"

export default function ProtectedRoute({ children }) {

  const { token } = useContext(AuthenticationContext)
  const location = useLocation()

  if (!token) {
    // Save where user was trying to go inside "state"
    return <Navigate to="/login" state={{ from: location.pathname }} />
  }

  return children
}