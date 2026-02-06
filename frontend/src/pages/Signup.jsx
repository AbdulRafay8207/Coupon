import { useState } from "react"
import { Link, useNavigate } from "react-router"
import logo from "../assets/logo2.png"
import "../style/signup.css"

const Signup = () => {
  const navigate = useNavigate()

  const [username,setUsername] = useState("")
  const [email,setEmail] = useState("")
  const [password,setPassword] = useState("")
  const [confirmPassword,setConfrimPassword] = useState("")
  const [message, setMessage] = useState(null)

const handleSubmit = async (e)=>{
  e.preventDefault()
  // if(!username || !email || !password || !confirmPassword ) return setMessage("All fields are required")
  if(!username) return setMessage("Username is required")
  if(!email) return setMessage("Email is required")
  if(!password) return setMessage("Password is required")
  if(!confirmPassword) return setMessage("Confirm password is required")
  if(password !== confirmPassword) return setMessage("Confirm password did not match")
  
  try{
    const response = await fetch("http://localhost:8000/signup",{
      method: "POST",
      headers:{
        "Content-Type": "application/json"
      },
      body: JSON.stringify({username,email,password,confirmPassword})
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
    <div id="container">
      <img src={logo} alt="bait-us-salam logo" />
      <h1>Signup</h1>
      {message && <p className="error-message">{message}</p>}
      <form onSubmit={handleSubmit}>
        <div className={message === "Username is required"? "incorrect" : ""}>
          <label htmlFor="username"><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="M367-527q-47-47-47-113t47-113q47-47 113-47t113 47q47 47 47 113t-47 113q-47 47-113 47t-113-47ZM160-160v-112q0-34 17.5-62.5T224-378q62-31 126-46.5T480-440q66 0 130 15.5T736-378q29 15 46.5 43.5T800-272v112H160Z"/></svg></label>
          <input type="text" name='username' id='username' placeholder='Enter Username' value={username} onChange={(e)=> setUsername(e.target.value)} onFocus={() => setMessage(null)} />
        </div>

        <div className={message === "Email is required"? "incorrect" : ""}>
          <label htmlFor="email"><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="M160-160q-33 0-56.5-23.5T80-240v-480q0-33 23.5-56.5T160-800h640q33 0 56.5 23.5T880-720v480q0 33-23.5 56.5T800-160H160Zm320-280 320-200v-80L480-520 160-720v80l320 200Z"/></svg></label>
          <input type="text" name='email' id='email' placeholder='Enter Email' value={email} onChange={(e)=> setEmail(e.target.value)} onFocus={() => setMessage(null)} />
        </div>

        <div className={message === "Password is required"? "incorrect" : message === "Confirm password did not match"? "incorrect" : ""}>
          <label htmlFor="password"><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="M240-80q-33 0-56.5-23.5T160-160v-400q0-33 23.5-56.5T240-640h40v-80q0-83 58.5-141.5T480-920q83 0 141.5 58.5T680-720v80h40q33 0 56.5 23.5T800-560v400q0 33-23.5 56.5T720-80H240Zm296.5-223.5Q560-327 560-360t-23.5-56.5Q513-440 480-440t-56.5 23.5Q400-393 400-360t23.5 56.5Q447-280 480-280t56.5-23.5ZM360-640h240v-80q0-50-35-85t-85-35q-50 0-85 35t-35 85v80Z"/></svg></label>
          <input type="text" name='password' id='password' placeholder='Enter Password' value={password} onChange={(e)=> setPassword(e.target.value)} onFocus={() => setMessage(null)} />
        </div>

        <div className={message === "Confrim password is required"? "incorrect" : message === "Confirm password did not match"? "incorrect" : ""}>
          <label htmlFor="password"><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="M240-80q-33 0-56.5-23.5T160-160v-400q0-33 23.5-56.5T240-640h40v-80q0-83 58.5-141.5T480-920q83 0 141.5 58.5T680-720v80h40q33 0 56.5 23.5T800-560v400q0 33-23.5 56.5T720-80H240Zm296.5-223.5Q560-327 560-360t-23.5-56.5Q513-440 480-440t-56.5 23.5Q400-393 400-360t23.5 56.5Q447-280 480-280t56.5-23.5ZM360-640h240v-80q0-50-35-85t-85-35q-50 0-85 35t-35 85v80Z"/></svg></label>
          <input type="text" name='password' id='password' placeholder='Confirm Password' value={confirmPassword} onChange={(e)=> setConfrimPassword(e.target.value)} onFocus={() => setMessage(null)} />
        </div>

        <button>Signup</button>
      </form>
      <p>Already have an account? <Link className="login" to={"/login"}>Login</Link></p>
    </div>
  )
}

export default Signup