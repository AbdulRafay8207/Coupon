import { createBrowserRouter, createRoutesFromElements, Navigate, Route, RouterProvider } from "react-router"
import CreateCard from "./pages/CreateCard"
import ValidateCard from "./pages/ValidateCard"
import AdminDashboard from "./pages/AdminDashboard"
import Navbar from "./components/Navbar"
import Login from "./pages/Login"
import { useEffect, useState } from "react"
const App = () => {

  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<Navbar/>}>
          <Route index element={<Login/>}/>
            <Route path="/dashboard" element={<AdminDashboard/>}/>
            <Route path="/create" element={<CreateCard/>}/>
            <Route path="/validate" element={<ValidateCard/>}/>
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