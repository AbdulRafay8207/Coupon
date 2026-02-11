import { useState } from "react"
import { API_BASE_URL } from "../config"
import getAuthHeader from "../components/GetAuthHeader"
import "../style/AddLabStaff.css"
import { useNavigate } from "react-router"

const AddLabStaff = () => {
    const [form, setForm] = useState({
        username: "",
        email: "",
        branchName: "",
        contactNumber: null,
        password: "",
        confirmPassword: ""
    })
    const [message, setMessage] = useState("")
    const [messageType, setMessageType] = useState("")
    const [loading, setLoading] = useState(false)

    const navigate = useNavigate()

    const handleChange = (e)=>{
        setForm({...form,[e.target.name]: e.target.value})
    }

    const handleSubmit = async (e)=>{
        e.preventDefault()
        setLoading(true)
        
        try {
            const response = await fetch(`${API_BASE_URL}/create-lab`,{
                method: "POST",
                headers: getAuthHeader(),
                body: JSON.stringify(form)
            })
            const data = await response.json()
            setMessageType(data.type)
            setMessage(data.message)
            if(data.type === "success") navigate("/staff-list")
        } catch (error) {
            console.log("Error in Add lab staff catch",error)
        } finally{
            setLoading(false)
        }
    }

  return (
      <div className="create-lab">
        <h1>Add Lab Staff</h1>
        <form onSubmit={handleSubmit} className="lab-form">

            <div className="form-group">
                <label>Username</label>
                <input name="username" placeholder="Enter Username" onChange={handleChange}/>
            </div>

            <div className="form-group">
                <label>Email</label>
                <input type="email" name="email" placeholder="Enter Email" onChange={handleChange}/>
            </div>

            <div className="form-group">
                <label>Branch Name</label>
                <input name="branchName" placeholder="Enter Branch Name" onChange={handleChange}/>
            </div>

            <div className="form-group">
                <label>Contact No</label>
                <input type="text" name="contactNumber" inputMode="numeric" maxLength={11} placeholder="Enter Contact Number" value={form.contactNumber} onChange={(e)=>{
                    const onlyNumbers = e.target.value.replace(/\D/g, "")
                    handleChange({
                        target: {
                            name: "contactNumber",
                            value: onlyNumbers
                        }
                    })
                }}/>
            </div>
            
            <div className="form-group">
                <label>Password</label>
                <input name="password" placeholder="Enter Password" onChange={handleChange}/>
            </div>

            <div className="form-group">
                <label>Confirm Password</label>
                <input name="confirmPassword" placeholder="Enter Password" onChange={handleChange}/>
            </div>

            <button className="submit-btn" disabled={loading}>{loading? <span className="spinner"></span> : "Create"}</button>
        {message && <p className={messageType === "success"? "success" : "error"}>{message}</p>}
        </form>
    </div>
  )
}

export default AddLabStaff