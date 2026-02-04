import { useState } from "react"
import { useNavigate } from "react-router"

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
    const response = await fetch("http://localhost:8000/login",{
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
    <div>
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>

        <label htmlFor="email">Email</label>
        <input type="text" name='email' id='email' placeholder='Enter Email' value={email} onChange={(e)=> setEmail(e.target.value)} />

        <label htmlFor="password">Password</label>
        <input type="text" name='password' id='password' placeholder='Enter Password' value={password} onChange={(e)=> setPassword(e.target.value)} />

        <button>Login</button>
        {message && <p>{message}</p>}
      </form>
    </div>
  )
}

export default Login