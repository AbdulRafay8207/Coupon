import { useState } from "react"
import { Link, useNavigate } from "react-router"
import logo from "../assets/logo2.png"
import "../style/signup.css"
import { fetchWithRefresh } from "../utils/api.js"
import { useAuth } from "../context/AuthContext"

const Signup = () => {
  const navigate = useNavigate()

  const [username,setUsername] = useState("")
  const [email,setEmail] = useState("")
  const [password,setPassword] = useState("")
  const [confirmPassword,setConfrimPassword] = useState("")
  const [contactNumber, setContactNumber] = useState("")
  const [message, setMessage] = useState(null)

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const {auth, setAuth} = useAuth()

const handleSubmit = async (e)=>{
  e.preventDefault()
  if(!username) return setMessage("Username is required")
  if(!email) return setMessage("Email is required")
  if(!password) return setMessage("Password is required")
  if(!confirmPassword) return setMessage("Confrim password is required")
  if(password !== confirmPassword) return setMessage("Confirm password did not match")
  if(!contactNumber) return setMessage("Contact number is required")
  
  try{
    const response = await fetchWithRefresh(`${import.meta.env.VITE_API_URL}/signup`,{
      method: "POST",
      headers:{
        "Content-Type": "application/json"
      },
      body: JSON.stringify({username,email,password,confirmPassword,contactNumber})
    },setAuth, navigate)
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
      <form className="signup-form" onSubmit={handleSubmit}>

        {/* Username------------------------------------------------- */}
        <div className={`input-container ${message === "Username is required"? "incorrect" : ""}`}>
          <label htmlFor="username"><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="M367-527q-47-47-47-113t47-113q47-47 113-47t113 47q47 47 47 113t-47 113q-47 47-113 47t-113-47ZM160-160v-112q0-34 17.5-62.5T224-378q62-31 126-46.5T480-440q66 0 130 15.5T736-378q29 15 46.5 43.5T800-272v112H160Z"/></svg></label>
          <input type="text" name='username' id='username' placeholder='Enter Username' value={username} onChange={(e)=> setUsername(e.target.value)} onFocus={() => setMessage(null)} />
        </div>

        {/* Email------------------------------------------------- */}
        <div className={`input-container ${message === "Email is required"? "incorrect" : ""}`}>
          <label htmlFor="email"><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="M160-160q-33 0-56.5-23.5T80-240v-480q0-33 23.5-56.5T160-800h640q33 0 56.5 23.5T880-720v480q0 33-23.5 56.5T800-160H160Zm320-280 320-200v-80L480-520 160-720v80l320 200Z"/></svg></label>
          <input type="text" name='email' id='email' placeholder='Enter Email' value={email} onChange={(e)=> setEmail(e.target.value)} onFocus={() => setMessage(null)} />
        </div>

        {/* Password------------------------------------------------- */}
        <div className={`input-container password-group ${message === "Password is required" || message === "Confirm password did not match"  ? "incorrect": ""}`}>
          <label htmlFor="password"><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="M240-80q-33 0-56.5-23.5T160-160v-400q0-33 23.5-56.5T240-640h40v-80q0-83 58.5-141.5T480-920q83 0 141.5 58.5T680-720v80h40q33 0 56.5 23.5T800-560v400q0 33-23.5 56.5T720-80H240Zm296.5-223.5Q560-327 560-360t-23.5-56.5Q513-440 480-440t-56.5 23.5Q400-393 400-360t23.5 56.5Q447-280 480-280t56.5-23.5ZM360-640h240v-80q0-50-35-85t-85-35q-50 0-85 35t-35 85v80Z"/></svg></label>
          <div className="input-wrapper">
            <input type={showPassword? "text" : "password"} name='password' id='password' placeholder='Enter Password' value={password} onChange={(e)=> setPassword(e.target.value)} onFocus={() => setMessage(null)} />
            <span className="toggle-btn" onClick={() => setShowPassword(!showPassword)}>{showPassword ? <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="M607.5-372.5Q660-425 660-500t-52.5-127.5Q555-680 480-680t-127.5 52.5Q300-575 300-500t52.5 127.5Q405-320 480-320t127.5-52.5Zm-204-51Q372-455 372-500t31.5-76.5Q435-608 480-608t76.5 31.5Q588-545 588-500t-31.5 76.5Q525-392 480-392t-76.5-31.5ZM214-281.5Q94-363 40-500q54-137 174-218.5T480-800q146 0 266 81.5T920-500q-54 137-174 218.5T480-200q-146 0-266-81.5ZM480-500Zm207.5 160.5Q782-399 832-500q-50-101-144.5-160.5T480-720q-113 0-207.5 59.5T128-500q50 101 144.5 160.5T480-280q113 0 207.5-59.5Z"/></svg> : <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="m644-428-58-58q9-47-27-88t-93-32l-58-58q17-8 34.5-12t37.5-4q75 0 127.5 52.5T660-500q0 20-4 37.5T644-428Zm128 126-58-56q38-29 67.5-63.5T832-500q-50-101-143.5-160.5T480-720q-29 0-57 4t-55 12l-62-62q41-17 84-25.5t90-8.5q151 0 269 83.5T920-500q-23 59-60.5 109.5T772-302Zm20 246L624-222q-35 11-70.5 16.5T480-200q-151 0-269-83.5T40-500q21-53 53-98.5t73-81.5L56-792l56-56 736 736-56 56ZM222-624q-29 26-53 57t-41 67q50 101 143.5 160.5T480-280q20 0 39-2.5t39-5.5l-36-38q-11 3-21 4.5t-21 1.5q-75 0-127.5-52.5T300-500q0-11 1.5-21t4.5-21l-84-82Zm319 93Zm-151 75Z"/></svg>}</span>
          </div>
        </div>

        {/* Confirm Password------------------------------------------------- */}
        <div className={`input-container password-group ${message === "Confirm password is required" || message === "Confirm password did not match"  ? "incorrect": ""}`}>
          <label htmlFor="confirmPassword"><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="M240-80q-33 0-56.5-23.5T160-160v-400q0-33 23.5-56.5T240-640h40v-80q0-83 58.5-141.5T480-920q83 0 141.5 58.5T680-720v80h40q33 0 56.5 23.5T800-560v400q0 33-23.5 56.5T720-80H240Zm296.5-223.5Q560-327 560-360t-23.5-56.5Q513-440 480-440t-56.5 23.5Q400-393 400-360t23.5 56.5Q447-280 480-280t56.5-23.5ZM360-640h240v-80q0-50-35-85t-85-35q-50 0-85 35t-35 85v80Z"/></svg></label>
          <div className="input-wrapper">
            <input type={showConfirmPassword? "text" : "password"} name='password' id='confirmPassword' placeholder='Confirm Password' value={confirmPassword} onChange={(e)=> setConfrimPassword(e.target.value)} onFocus={() => setMessage(null)} />
            <span className="toggle-btn" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>{showConfirmPassword ? <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="M607.5-372.5Q660-425 660-500t-52.5-127.5Q555-680 480-680t-127.5 52.5Q300-575 300-500t52.5 127.5Q405-320 480-320t127.5-52.5Zm-204-51Q372-455 372-500t31.5-76.5Q435-608 480-608t76.5 31.5Q588-545 588-500t-31.5 76.5Q525-392 480-392t-76.5-31.5ZM214-281.5Q94-363 40-500q54-137 174-218.5T480-800q146 0 266 81.5T920-500q-54 137-174 218.5T480-200q-146 0-266-81.5ZM480-500Zm207.5 160.5Q782-399 832-500q-50-101-144.5-160.5T480-720q-113 0-207.5 59.5T128-500q50 101 144.5 160.5T480-280q113 0 207.5-59.5Z"/></svg> : <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="m644-428-58-58q9-47-27-88t-93-32l-58-58q17-8 34.5-12t37.5-4q75 0 127.5 52.5T660-500q0 20-4 37.5T644-428Zm128 126-58-56q38-29 67.5-63.5T832-500q-50-101-143.5-160.5T480-720q-29 0-57 4t-55 12l-62-62q41-17 84-25.5t90-8.5q151 0 269 83.5T920-500q-23 59-60.5 109.5T772-302Zm20 246L624-222q-35 11-70.5 16.5T480-200q-151 0-269-83.5T40-500q21-53 53-98.5t73-81.5L56-792l56-56 736 736-56 56ZM222-624q-29 26-53 57t-41 67q50 101 143.5 160.5T480-280q20 0 39-2.5t39-5.5l-36-38q-11 3-21 4.5t-21 1.5q-75 0-127.5-52.5T300-500q0-11 1.5-21t4.5-21l-84-82Zm319 93Zm-151 75Z"/></svg>}</span>
          </div>
        </div>

        {/* Contact Number------------------------------------------------- */}
        <div className={`input-container ${message === "Contact number is required"? "incorrect" : ""}`}>
          <label htmlFor="contactNumber"><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="M798-120q-125 0-247-54.5T329-329Q229-429 174.5-551T120-798q0-18 12-30t30-12h162q14 0 25 9.5t13 22.5l26 140q2 16-1 27t-11 19l-97 98q20 37 47.5 71.5T387-386q31 31 65 57.5t72 48.5l94-94q9-9 23.5-13.5T670-390l138 28q14 4 23 14.5t9 23.5v162q0 18-12 30t-30 12Z"/></svg></label>
          <input type="text" name="contactNumber" id="contactNumber" inputMode="numeric" maxLength={11} placeholder="Enter Contact Number" value={contactNumber} onChange={(e)=>{
                    const onlyNumbers = e.target.value.replace(/\D/g, "")
                    setContactNumber(onlyNumbers)
                }} onFocus={() => setMessage(null)} />
        </div>

        <button>Signup</button>
      </form>
      <p>Already have an account? <Link className="login" to={"/login"}>Login</Link></p>
    </div>
  )
}

export default Signup