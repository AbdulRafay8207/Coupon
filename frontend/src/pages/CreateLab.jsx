import { useState } from "react"
import { API_BASE_URL } from "../config"
import getAuthHeader from "../components/GetAuthHeader"
import "../style/AddLab.css"

const CreateLab = () => {
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

    const handleChange = (e)=>{
        setForm({...form,[e.target.name]: e.target.value})
    }

    const handleSubmit = async (e)=>{
        e.preventDefault()

        const response = await fetch(`${API_BASE_URL}/create-lab`,{
            method: "POST",
            headers: getAuthHeader(),
            body: JSON.stringify(form)
        })
        const data = await response.json()
        setMessageType(data.type)
        setMessage(data.message)
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
                <input name="email" placeholder="Enter Email" onChange={handleChange}/>
            </div>

            <div className="form-group">
                <label>Branch Name</label>
                <input name="branchName" placeholder="Enter Branch Name" onChange={handleChange}/>
            </div>

            <div className="form-group">
                <label>Contact No</label>
                <input type="tel" name="contactNumber" inputMode="numeric" placeholder="Enter Contact Number" onChange={handleChange}/>
            </div>
            
            <div className="form-group">
                <label>Password</label>
                <input name="password" placeholder="Enter Password" onChange={handleChange}/>
            </div>

            <div className="form-group">
                <label>Confirm Password</label>
                <input name="confirmPassword" placeholder="Enter Password" onChange={handleChange}/>
            </div>

            <button className="submit-btn">Create</button>
        {message && <p className={messageType === "success"? "success" : "error"}>{message}</p>}
        </form>
    </div>
  )
}

export default CreateLab