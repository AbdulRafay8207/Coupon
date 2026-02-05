import { NavLink, Outlet } from "react-router"

const Navbar = () => {
  const role = localStorage.getItem("role")
  return (
    <div>
        {role === "admin" && (
          <>
            <NavLink className={"Nav"} to={"/dashboard"}>AdminDashboard</NavLink>
            <NavLink className={"Nav"} to={"/create"}>Create</NavLink>
            <NavLink className={"Nav"} to={"/create-lab"}>Add Lab-tech</NavLink>
          </>
        )}
        {(role === "admin" || role === "lab") && (
          <NavLink className={"Nav"} to={"/validate"}>Validate</NavLink>
        )}
        <Outlet/>   
    </div>
  )
}

export default Navbar