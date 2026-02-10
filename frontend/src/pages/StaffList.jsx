import { useEffect, useState } from "react"
import { API_BASE_URL } from "../config"
import getAuthHeader from "../components/GetAuthHeader"
import "../style/StaffList.css"

const StaffList = () => {
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState(null)
    const [staffList, setStaffList] = useState([])
    const [findStaff, setFindStaff] = useState("")
    const [status, setStatus] = useState("All")

    useEffect(()=>{
        fetchStaffList(status)
    },[status])

    async function fetchStaffList(status){
        setLoading(true)
        try{
            const response = await fetch(`${API_BASE_URL}/staff-list?status=${status}`,
                {
                    headers: getAuthHeader()
                },
            )
            const data = await response.json()
            setMessage(data.message)
            setStaffList(data.allStaff)

            console.log("staff",staffList);
            
        }catch(err){
            console.log("Error in fetchStaffList",err)
        }finally{
            setLoading(false)
        }
    }

    async function inactivateStaff(id){
        try {
            const response = await fetch(`${API_BASE_URL}/staff-status`,{
                method: "POST",
                headers: getAuthHeader(),
                body: JSON.stringify({id,status: "Inactive"})
            })
            const data = await response.json()
            setMessage(data.message)
            fetchStaffList(status)
        } catch (error) {
            console.log("Error in inactive staff function",error)
        }
    }

    async function activateStaff(id){
        try {
            const response = await fetch(`${API_BASE_URL}/staff-status`,{
                method: "POST",
                headers: getAuthHeader(),
                body: JSON.stringify({id, status: "Active"})
            })
            const data = await response.json()
            setMessage(data.message)
            fetchStaffList(status)
        } catch (err) {
            console.log("Error in active staff function",err)
        }
    }

    async function findStaffFunction() {
        if(!findStaff.trim()) return alert("Please Enter Username")
        const response = await fetch(`${API_BASE_URL}/find-staff`,{
            method: "POST",
            headers: getAuthHeader(),
            body: JSON.stringify({findStaff})
        })
        const data = await response.json()
        setMessage(data.message)
        if(!response.ok){
            alert(data.message)
            return
        }
            setStaffList(data.foundStaff)
    }

  return (
    <div className="main-container">
        <div className="headingContainer">
            <h1>Staff List</h1>
            <p>Manage Staff List</p>
        </div>

        <div className="staff-filter">

            <div className="filter-group">
            <input type="text" value={findStaff} onChange={(e)=> setFindStaff(e.target.value)} placeholder="Enter Username" />
            <button className="find-btn" onClick={findStaffFunction}>Find</button>
            </div>
        
            <div>
            <select className="filter-group" value={status} onChange={(e) => setStatus(e.target.value)}>
                <option value="All">All</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
            </select>
            </div>
        </div>

        <div className="table-container">
            {loading? (
                <p>Loading...</p>
            ) : (
                <table className="table">
                    <thead>
                        <tr>
                            <th>Username</th>
                            <th>Email</th>
                            <th>Branch Name</th>
                            <th>Contact No.</th>
                            <th>Password</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Array.isArray(staffList) && staffList.map((staff)=>(
                            <tr key={staff._id}>
                                <td>{staff.username}</td>
                                <td>{staff.email}</td>
                                <td>{staff.branchName}</td>
                                <td>{staff.contactNumber}</td>
                                <td>{staff.password}</td>
                                <td>{staff.status}</td>
                                <td>{staff.status === "Active"? <button className={staff.status === "Active" ? "danger" : ""} onClick={() => inactivateStaff(staff._id)}>Inactive</button> : <button  onClick={()=> activateStaff(staff._id)}>Active</button>}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) }
        </div>
    </div>
  )
}

export default StaffList