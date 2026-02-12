import { useEffect, useState } from "react"
import getAuthHeader from "../components/GetAuthHeader"
import "../style/AddLabStaff.css"
import { useNavigate, useParams } from "react-router"

const EditLabStaff = () => {
  const { id } = useParams()
  const navigate = useNavigate()

  const [form, setForm] = useState({
    username: "",
    email: "",
    branchName: "",
    contactNumber: "",
    password: "",
    confirmPassword: ""
  })

  const [message, setMessage] = useState("")
  const [messageType, setMessageType] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchStaff()
  }, [])

  const fetchStaff = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/staff/${id}`, {
        headers: getAuthHeader()
      })
      const data = await response.json()

      if (!response.ok) {
        setMessageType("error")
        setMessage(data.message)
        return
      }

      setForm({
        username: data.staff.username,
        email: data.staff.email,
        branchName: data.staff.branchName,
        contactNumber: data.staff.contactNumber,
        password: "",          
        confirmPassword: ""    
      })
    } catch (err) {
      console.log(err)
    }
  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    if (form.password !== form.confirmPassword) {
      setMessageType("error")
      setMessage("Passwords do not match")
      setLoading(false)
      return
    }

    try {
      const response = await fetch(`${API_BASE_URL}/edit-staff/${id}`, {
        method: "PUT",
        headers: getAuthHeader(),
        body: JSON.stringify(form)
      })

      const data = await response.json()
      setMessageType(data.type)
      setMessage(data.message)

      if (data.type === "success") {
        navigate("/staff-list")
      }
    } catch (err) {
      console.log(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="create-lab">
      <h1>Edit Staff</h1>
      <form onSubmit={handleSubmit} className="lab-form">

        <div className="form-group">
          <label>Username</label>
          <input name="username" value={form.username} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label>Email</label>
          <input type="email" name="email" value={form.email} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label>Branch Name</label>
          <input name="branchName" value={form.branchName} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label>Contact No</label>
          <input
            type="text"
            name="contactNumber"
            value={form.contactNumber}
            onChange={(e) => {
              const onlyNumbers = e.target.value.replace(/\D/g, "")
              setForm({ ...form, contactNumber: onlyNumbers })
            }}
          />
        </div>

        <div className="form-group">
          <label>New Password (Optional)</label>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Confirm New Password</label>
          <input
            type="password"
            name="confirmPassword"
            value={form.confirmPassword}
            onChange={handleChange}
          />
        </div>

        <button className="submit-btn" disabled={loading}>
          {loading ? <span className="spinner"></span> : "Update"}
        </button>
        <button className="cancel-btn" onClick={() => navigate("/staff-list")}>Cancel</button>

        {message && (
          <p className={messageType === "success" ? "success" : "error"}>
            {message}
          </p>
        )}
      </form>
    </div>
  )
}

export default EditLabStaff
