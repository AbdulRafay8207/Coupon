import { useState } from "react"
import { API_BASE_URL } from "../config"
import { useNavigate } from "react-router"
import "../style/login.css"

const Login = () => {
  const navigate = useNavigate()

  const [email,setEmail] = useState("")
  const [password,setPassword] = useState("")
  const [message, setMessage] = useState(null)

const handleSubmit = async (e)=>{
  e.preventDefault()
  if(!email) return setMessage("Email is required")
  if(!password) return setMessage("Password is required")
  
  try{
    const response = await fetch(`${API_BASE_URL}/login`,{
      method: "POST",
      headers:{
        "Content-Type": "application/json"
      },
      body: JSON.stringify({email,password})
    })
    const data = await response.json()
    setMessage(data.message)
  
    // if(data.user === null) return
    console.log(message);
    console.log(data);
    
    if(data.uid){
      const payLoad = JSON.parse(atob(data.uid.split(".")[1]))
      localStorage.setItem("role", payLoad.role)
      localStorage.setItem("token",data.uid)
      if (payLoad.role === "admin") {
    navigate("/dashboard")
  } else {
    navigate("/validate")
  }

    }
    
  }catch(err){
    console.log("something wrong in catch",err);
    
  }
}

  return (
    <div id="container">
      <div id="box">
        <h1>Login</h1>
        <form onSubmit={handleSubmit}>

          <div>
          <label htmlFor="email"><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="M160-160q-33 0-56.5-23.5T80-240v-480q0-33 23.5-56.5T160-800h640q33 0 56.5 23.5T880-720v480q0 33-23.5 56.5T800-160H160Zm320-280 320-200v-80L480-520 160-720v80l320 200Z"/></svg></label>
          <input type="text" name='email' id='email' placeholder='Enter Email' value={email} onChange={(e)=> setEmail(e.target.value)} />
          </div>

          <div>
          <label htmlFor="password"><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="M240-80q-33 0-56.5-23.5T160-160v-400q0-33 23.5-56.5T240-640h40v-80q0-83 58.5-141.5T480-920q83 0 141.5 58.5T680-720v80h40q33 0 56.5 23.5T800-560v400q0 33-23.5 56.5T720-80H240Zm296.5-223.5Q560-327 560-360t-23.5-56.5Q513-440 480-440t-56.5 23.5Q400-393 400-360t23.5 56.5Q447-280 480-280t56.5-23.5ZM360-640h240v-80q0-50-35-85t-85-35q-50 0-85 35t-35 85v80Z"/></svg></label>
          <input type="text" name='password' id='password' placeholder='Enter Password' value={password} onChange={(e)=> setPassword(e.target.value)} />
          </div>

          <button>Login</button>
        </form>
        <p>Already have an account?</p>
          {message && <p>{message}</p>}
      </div>
    </div>
  )
}

export default Login