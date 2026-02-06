import { Outlet } from "react-router"
import Sidebar from "../components/Sidebar"
// import "../style/dashboard.css"
import "../style/newDashboard.css"

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