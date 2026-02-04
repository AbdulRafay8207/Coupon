import { useState } from "react"
import getAuthHeader from "../components/GetAuthHeader"

const CreateLab = () => {
    const [form, setForm] = useState({
        username: "",
        email: "",
        password: ""
    })
    const [message, setMessage] = useState("")

    const handleChange = (e)=>{
        setForm({...form,[e.target.name]: e.target.value})
    }

    const handleSubmit = async (e)=>{
        e.preventDefault()

        const response = await fetch("http://localhost:8000/create-lab",{
            method: "POST",
            headers: getAuthHeader(),
            body: JSON.stringify(form)
        })
        const data = await response.json()
        setMessage(data.message)
    }

  return (
    <div>
        <h1>Create Lab Technician</h1>
        <form onSubmit={handleSubmit}>
            <input name="username" placeholder="Enter Username" onChange={handleChange}/>
            <input name="email" placeholder="Enter email" onChange={handleChange}/>
            <input name="password" placeholder="Enter Password" onChange={handleChange}/>
            <button>Create</button>
        </form>
        {message && <p>{message}</p>}
    </div>
  )
}

export default CreateLab