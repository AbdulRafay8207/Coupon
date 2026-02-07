import { Outlet } from "react-router"
import Sidebar from "../components/Sidebar"
import "../style/Dashboard.css"

const DashboardLayout = () => {
  return (
    <div className="app-layout">
        <Sidebar/>
        <main className="app-main">
            <Outlet/>
        </main>
    </div>
  )
}

export default DashboardLayout