import { Outlet, Navigate } from "react-router"
import { useAuth } from "../context/AuthContext"

const ProtectedRoute = () => {
  const {auth, loading} = useAuth()
  
  if(loading) return <div className="spinner">Loading...</div>
  if(!auth.accessToken) return <Navigate to="/login" replace />  

  return <Outlet />
}

export default ProtectedRoute