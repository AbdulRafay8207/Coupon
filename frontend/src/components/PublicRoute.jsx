import { Navigate, Outlet } from "react-router"
import { useAuth } from "../context/AuthContext"

const PublicRoute = () => {
    const {auth, loading} = useAuth()

    if(loading) return <div className="spinner">Loading...</div>
    if(auth.accessToken){
        if(auth.role === "admin"){
            return <Navigate to={"/dashboard"} replace/>
        }
        return <Navigate to={"/validate"} replace/>
    }
    return <Outlet/>
}

export default PublicRoute