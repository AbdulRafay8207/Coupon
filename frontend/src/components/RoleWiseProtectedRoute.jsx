import { Navigate, Outlet } from "react-router"

const RoleWiseProtectedRoute = ({allowedRole}) => {
    const token = localStorage.getItem("token")
    const role = localStorage.getItem("role")

    if(!token) return <Navigate to={"/login"} replace/>
    if(!allowedRole.includes(role)) return <Navigate to={"/validate"} replace/>

    return <Outlet/>
}

export default RoleWiseProtectedRoute