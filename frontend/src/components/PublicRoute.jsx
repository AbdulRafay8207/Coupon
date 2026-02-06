import { Navigate, Outlet } from "react-router"

const PublicRoute = () => {
    const token = localStorage.getItem("token")
    const role = localStorage.getItem("role")
    if(token){
        if(role === "admin"){
            return <Navigate to={"/dashboard"} replace/>
        }
        return <Navigate to={"/validate"} replace/>
    }
    return <Outlet/>
}

export default PublicRoute