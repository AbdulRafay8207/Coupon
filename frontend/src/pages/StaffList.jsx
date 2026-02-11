import { useEffect, useState } from "react"
import { API_BASE_URL } from "../config"
import getAuthHeader from "../components/GetAuthHeader"
import "../style/StaffList.css"
import { useLocation, useNavigate } from "react-router"

const StaffList = () => {
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState(null)
    const [staffList, setStaffList] = useState([])
    const [findStaff, setFindStaff] = useState("")
    const [status, setStatus] = useState("All")
    const [editMode, setEditMode] = useState(null)

    const location = useLocation()
    const navigate = useNavigate()

    useEffect(() => {
        fetchStaffList(status, findStaff)
    }, [status, findStaff, location.key])

    async function fetchStaffList(status, search) {
        setLoading(true)
        try {
            const response = await fetch(`${API_BASE_URL}/staff-list?status=${status}&search=${search || ""}`,
                {
                    headers: getAuthHeader()
                },
            )
            const data = await response.json()
            setMessage(data.message)
            setStaffList(data.allStaff)

            console.log("staff", staffList);

        } catch (err) {
            console.log("Error in fetchStaffList", err)
        } finally {
            setLoading(false)
        }
    }

    async function inactivateStaff(id) {
        try {
            const response = await fetch(`${API_BASE_URL}/staff-status`, {
                method: "POST",
                headers: getAuthHeader(),
                body: JSON.stringify({ id, status: "Inactive" })
            })
            const data = await response.json()
            setMessage(data.message)
            fetchStaffList(status)
        } catch (error) {
            console.log("Error in inactive staff function", error)
        }
    }

    async function activateStaff(id) {
        try {
            const response = await fetch(`${API_BASE_URL}/staff-status`, {
                method: "POST",
                headers: getAuthHeader(),
                body: JSON.stringify({ id, status: "Active" })
            })
            const data = await response.json()
            setMessage(data.message)
            fetchStaffList(status)
        } catch (err) {
            console.log("Error in active staff function", err)
        }
    }

    function clearFilter(){
        setFindStaff("")
        setStatus("All")
        return
    }

    async function handleUpdate(){
        try {
            const response = await fetch(`${API_BASE_URL}/edit-staff/${editMode._id}`,{
                method: "PUT",
                headers: getAuthHeader(),
                body: JSON.stringify({editMode})
            }) 
            const data = await response.json()
            setMessage(data.message)
            setEditMode(false)
            fetchStaffList(status,findStaff)
        } catch (error) {
            console.log("error in handleUpdate function",error);
        }
    }

    return (
        <div className="main-container">
            <div className="headingContainer">
                <h1>Staff List</h1>
                <p>Manage Staff List</p>
            </div>

            <div className="staff-filter">

                <div className="filter-group">
                    <input type="text" value={findStaff} onChange={(e) => setFindStaff(e.target.value)} placeholder="Enter Username" />
                </div>

                <div>
                    <select className="filter-group" value={status} onChange={(e) => setStatus(e.target.value)}>
                        <option value="All">All</option>
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                    </select>
                </div>

                <div className="filter-group">
                    <button className="find-btn" onClick={clearFilter}>Clear Filter</button>
                </div>

            </div>

            {editMode && (
                <div className="edit-box">
                    <h3>Edit Staff</h3>

                    <input type="text" value={editMode.username} onChange={(e)=> setEditMode({...editMode, username: e.target.value})}/>

                    <input type="email" value={editMode.email} onChange={(e)=> setEditMode({...editMode, email: e.target.value})}/>

                    <input type="text" value={editMode.branchName} onChange={(e)=> setEditMode({...editMode, branchName: e.target.value})}/>
                    
                    <input type="text" inputMode="numeric" maxLength={11} value={editMode.contactNumber} onChange={(e)=> {
                        const onlyNumbers = e.target.value.replace(/\D/g, "")
                        setEditMode({...editMode, contactNumber: onlyNumbers})
                    }}/>

                    <input type="password" value={editMode.password || ""} onChange={(e)=> setEditMode({...editMode, password: e.target.value})}/>

                    <input type="password" value={editMode.confirmPassword || ""} onChange={(e)=> setEditMode({...editMode, confirmPassword: e.target.value})}/>
                    
                    <button onClick={() => setEditMode(false)}>Cancel</button>
                    <button onClick={()=> handleUpdate}>Save</button>

                </div>
            )}

            <div className="table-container">
                {loading ? (
                    <p>Loading...</p>
                ) : (
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Username</th>
                                <th>Email</th>
                                <th>Branch Name</th>
                                <th>Contact No.</th>
                                <th>Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Array.isArray(staffList) && staffList.length > 0 ? (
                                staffList.map((staff) => (
                                    <tr key={staff._id}>
                                        <td>{staff.username}</td>
                                        <td>{staff.email}</td>
                                        <td>{staff.branchName}</td>
                                        <td>{staff.contactNumber}</td>
                                        <td>{staff.status}</td>
                                        <td>
                                            {staff.status === "Active" ? (
                                                <button
                                                    className="danger"
                                                    onClick={() => inactivateStaff(staff._id)}
                                                >
                                                    Inactive
                                                </button>
                                            ) : (
                                                <button onClick={() => activateStaff(staff._id)}>
                                                    Active
                                                </button>
                                            )}
                                            <button className="edit-btn" onClick={() => navigate(`/edit-staff/${staff._id}`)}>Edit</button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="no-data">
                                        No user found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    )
}

export default StaffList