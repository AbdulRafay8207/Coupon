import { createBrowserRouter, createRoutesFromElements, Navigate, Route, RouterProvider } from "react-router"
import CreateCoupons from "./pages/CreateCoupons"
import ValidateCard from "./pages/ValidateCard"
import AdminDashboard from "./pages/AdminDashboard"
import Navbar from "./components/Navbar"
import Signup from "./pages/Signup"
import Login from "./pages/Login"
const App = () => {

  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route>
        <Route path="/"  element={<Navbar/>}>
            <Route path="/dashboard" element={<AdminDashboard/>}/>
            <Route path="/create" element={<CreateCoupons/>}/>
            <Route path="/validate" element={<ValidateCard/>}/>
        </Route>
        <Route index element={<Signup/>}/>
        <Route path="/login" element={<Login/>}/>
      </Route>
    )
  )
  return (
    <div>
      <RouterProvider router={router}/>
    </div>
  )
}

export default App