import { useState } from "react"
import { useNavigate } from "react-router"

const Signup = () => {
  const navigate = useNavigate()

  const [username,setUsername] = useState("")
  const [email,setEmail] = useState("")
  const [password,setPassword] = useState("")
  const [message, setMessage] = useState(null)

const handleSubmit = async (e)=>{
  e.preventDefault()
  
  try{
    const response = await fetch("http://localhost:8000/signup",{
      method: "POST",
      headers:{
        "Content-Type": "application/json"
      },
      body: JSON.stringify({username,email,password})
    })
    const data = await response.json()
    setMessage(data.message)
    console.log(message);
    if(response.ok){
      navigate("/dashboard")
    }
    
  }catch(err){
    console.log("something wrong in catch",err);
    
  }
}

  return (
    <div>
      <h1>Signup</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="username">Username</label>
        <input type="text" name='username' id='username' placeholder='Enter Username' value={username} onChange={(e)=> setUsername(e.target.value)} />

        <label htmlFor="email">Email</label>
        <input type="text" name='email' id='email' placeholder='Enter Email' value={email} onChange={(e)=> setEmail(e.target.value)} />

        <label htmlFor="password">Password</label>
        <input type="text" name='password' id='password' placeholder='Enter Password' value={password} onChange={(e)=> setPassword(e.target.value)} />

        <button>Signup</button>
        {message && <p>{message}</p>}
      </form>
    </div>
  )
}

export default Signup