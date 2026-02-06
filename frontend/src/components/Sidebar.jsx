import { useState } from "react"
import { NavLink } from "react-router"
import logo from "../assets/logo2.png"
// import "../style/sidebar.css"
import "../style/newDashboard.css"

const Sidebar = () => {
    const role = localStorage.getItem("role")
    const [collapsed, setCollapsed] = useState(false)

    function logout(){
        localStorage.removeItem("token")
        localStorage.removeItem("role")
        window.location.href = "/login"
    }

  return (
    <nav id="sidebar" className={collapsed? "close" : ""}>
        <ul>
            {/* Toggle */}
            <li>
                <button className="menu-btn" onClick={() => setCollapsed(prev => !prev)}><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="M120-240v-80h720v80H120Zm0-200v-80h720v80H120Zm0-200v-80h720v80H120Z"/></svg></button>
            </li>
            <li>
                <img className="logo" src={logo} alt="bait-us-salam logo" />
            </li>

            {/* Admin */}
            {role === "admin" &&(
                <>
                <li>
                    
                    <NavLink className={"navlink"} to={"/dashboard"}>Dashboard</NavLink>
                </li>

                <li>
                    <NavLink className={"navlink"} to={"/create"}>Generate Coupons</NavLink>
                </li>

                <li>
                    <NavLink className={"navlink"} to={"/create-lab"}>Add Lab Tech</NavLink>
                </li>
                </>
            )}

            {/* Admin + Lab */}
            {(role === "admin" || role === "lab") &&(
                <li>
                    <NavLink className={"navlink"} to={"/validate"}>Scan QR</NavLink>
                </li>
            )}
        </ul>
        <button style={{marginTop: "480px"}} onClick={logout}>Logout</button>
    </nav>
  )
}

export default Sidebar