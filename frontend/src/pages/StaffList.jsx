import { useState } from "react"
import { API_BASE_URL } from "../config"
import getAuthHeader from "../components/GetAuthHeader"

const StaffList = () => {
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState(null)
    const [staffList, setStaffList] = useState([])

    async function fetchStaffList(){
        setLoading(true)
        try{
            const response = await fetch(`${API_BASE_URL}/staff-list`,
                {
                    headers: getAuthHeader()
                }
            )
            const data = await response.json()
            setMessage(data.message)
            setStaffList(data.allStaff)
        }catch(err){
            console.log("Error in fetchStaffList",err)
        }
    }
  return (
    <div className="main-container">
        <h1>Staff List</h1>
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
                        </tr>
                    </thead>
                    <tbody>
                        {staffList.map((staff)=>(
                            <tr key={staff}></tr>
                        ))}
                    </tbody>
                </table>
            ) }
        </div>
    </div>
  )
}

export default StaffList