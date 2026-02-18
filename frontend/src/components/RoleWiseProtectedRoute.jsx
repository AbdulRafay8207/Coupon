import { Navigate, Outlet } from "react-router"
import { useAuth } from "../context/AuthContext"

const RoleWiseProtectedRoute = ({allowedRole}) => {
    const {auth, loading} = useAuth()

    if(loading) return <div className="spinner">Loading...</div>

    if(!auth.accessToken) return <Navigate to={"/login"} replace/>

    if(!allowedRole.includes(auth.role)) return <Navigate to={"/validate"} replace/>
    
    return <Outlet/>
}

export default RoleWiseProtectedRoute