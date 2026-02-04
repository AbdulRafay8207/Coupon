import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider
} from "react-router"

import CreateCoupons from "./pages/CreateCoupons"
import ValidateCard from "./pages/ValidateCard"
import AdminDashboard from "./pages/AdminDashboard"
import Navbar from "./components/Navbar"
import Signup from "./pages/Signup"
import Login from "./pages/Login"
import ProtectedRoute from "./components/ProtectedRoute"
import RoleWiseProtectedRoute from "./components/RoleWiseProtectedRoute"
import CreateLab from "./pages/CreateLab"

const App = () => {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route>

        {/* PUBLIC */}
        <Route index element={<Signup />} />
        <Route path="/login" element={<Login />} />

        {/* AUTH REQUIRED */}
        <Route element={<ProtectedRoute />}>
          
          {/* NAVBAR FOR ALL LOGGED USERS */}
          <Route element={<Navbar />}>

            {/* ADMIN ONLY */}
            <Route element={<RoleWiseProtectedRoute allowedRole={["admin"]} />}>
              <Route path="/dashboard" element={<AdminDashboard />} />
              <Route path="/create" element={<CreateCoupons />} />
              <Route path="/create-lab" element={<CreateLab />} />
            </Route>

            {/* ADMIN + LAB */}
            <Route element={<RoleWiseProtectedRoute allowedRole={["admin", "lab"]} />}>
              <Route path="/validate" element={<ValidateCard />} />
            </Route>

          </Route>
        </Route>
      </Route>
    )
  )

  return <RouterProvider router={router} />
}

export default App
