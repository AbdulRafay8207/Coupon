import { useState } from "react"
import { NavLink } from "react-router"
import logo from "../assets/logo2.png"
import "../style/Dashboard.css"


const Sidebar = () => {
    const role = localStorage.getItem("role")
    const username = localStorage.getItem("username")
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
            <li className="user-info">
                <div className="username">{username}</div>
                <div className="role">{role}</div>
            </li>
            <li>
                <NavLink className={"logonavlink"} to={"/dashboard"}>
                    <img className="logo" src={logo} alt="bait-us-salam logo" />
                </NavLink>
            </li>

            {/* Admin */}
            {role === "admin" &&(
                <>
                <li>
                    <NavLink className={"navlink"} to={"/dashboard"}>
                        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="M520-600v-240h320v240H520ZM120-440v-400h320v400H120Zm400 320v-400h320v400H520Zm-400 0v-240h320v240H120Z"/></svg>
                        <span>Dashboard</span>
                    </NavLink>
                </li>

                <li>
                    <NavLink className={"navlink"} to={"/create"}>
                        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="M440-280h80v-160h160v-80H520v-160h-80v160H280v80h160v160Zm40 200q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Z"/></svg>
                        <span>Generate Coupons</span>
                    </NavLink>
                </li>

                <li>
                    <NavLink className={"navlink"} to={"/create-lab"}>
                        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="M720-400v-120H600v-80h120v-120h80v120h120v80H800v120h-80ZM247-527q-47-47-47-113t47-113q47-47 113-47t113 47q47 47 47 113t-47 113q-47 47-113 47t-113-47ZM40-160v-112q0-34 17.5-62.5T104-378q62-31 126-46.5T360-440q66 0 130 15.5T616-378q29 15 46.5 43.5T680-272v112H40Z"/></svg>
                        <span>Add Lab Staff</span>
                    </NavLink>
                </li>

                <li>
                    <NavLink className={"navlink"} to={"/staff-list"}>
                        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="M555-435q-35-35-35-85t35-85q35-35 85-35t85 35q35 35 35 85t-35 85q-35 35-85 35t-85-35ZM400-160v-76q0-21 10-40t28-30q45-27 95.5-40.5T640-360q56 0 106.5 13.5T842-306q18 11 28 30t10 40v76H400ZM120-400v-80h320v80H120Zm0-320v-80h480v80H120Zm324 160H120v-80h360q-14 17-22.5 37T444-560Z"/></svg>
                        <span>Staff List</span>
                    </NavLink>
                </li>
                </>
            )}

            {/* Admin + Lab */}
            {(role === "admin" || role === "lab") &&(
                <li>
                    <NavLink className={"navlink"} to={"/validate"}>
                        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="M80-680v-200h200v80H160v120H80Zm0 600v-200h80v120h120v80H80Zm600 0v-80h120v-120h80v200H680Zm120-600v-120H680v-80h200v200h-80ZM700-260h60v60h-60v-60Zm0-120h60v60h-60v-60Zm-60 60h60v60h-60v-60Zm-60 60h60v60h-60v-60Zm-60-60h60v60h-60v-60Zm120-120h60v60h-60v-60Zm-60 60h60v60h-60v-60Zm-60-60h60v60h-60v-60Zm240-320v240H520v-240h240ZM440-440v240H200v-240h240Zm0-320v240H200v-240h240Zm-60 500v-120H260v120h120Zm0-320v-120H260v120h120Zm320 0v-120H580v120h120Z"/></svg>
                        <span>Scan QR</span>
                    </NavLink>
                </li>
            )}
        </ul>
        <button className="logout" onClick={logout}>
            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h280v80H200v560h280v80H200Zm440-160-55-58 102-102H360v-80h327L585-622l55-58 200 200-200 200Z"/></svg>
            <span>Logout</span>
        </button>
    </nav>
  )
}

export default Sidebar