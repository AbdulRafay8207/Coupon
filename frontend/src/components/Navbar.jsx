import { NavLink, Outlet } from "react-router"

const Navbar = () => {
  return (
    <div>
        <NavLink className={"Nav"} to={"/dashboard"}>AdminDashboard</NavLink>
        <NavLink className={"Nav"} to={"/create"}>Create</NavLink>
        <NavLink className={"Nav"} to={"/validate"}>Validate</NavLink>
        <Outlet/>   
    </div>
  )
}

export default Navbar