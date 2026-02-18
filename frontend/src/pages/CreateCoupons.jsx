import { useState } from "react"
import { useNavigate } from "react-router"
import getAuthHeader from "../utils/getAuthHeader.js"
import "../style/CreateCoupons.css"
import { useAuth } from "../context/AuthContext"
import { fetchWithRefresh } from "../utils/api.js"

const CreateCoupons = () => {
    const navigate = useNavigate()

    const {auth, setAuth} = useAuth()

    const [formData, setFormData] = useState({
        discountValue: "",
        area: "",
        validFrom:"",
        validTo:"",
        discountType: "flat",
        services: "",
        quantity: 1,
        sponsoredName: "",
        tokenSequence: ""
    })
    const [message, setMessage] = useState("")
    const [messageType, setMessageType] = useState("")
    const [loading, setLoading] = useState(false)

    const handleChange = (e)=>{
        const {name, value} = e.target
        setFormData({...formData,[name]:value})
    }
    
    const handleSubmit = async (e)=>{
        e.preventDefault()
        setLoading(true)

        const payload = {
            ...formData,
            services: formData.discountType === "service"? formData.services.split(",").map(s => s.trim()) : []
        }
        
        try {
            const response = await fetchWithRefresh(`${import.meta.env.VITE_API_URL}/coupons/create`, {
                method: "POST",
                headers: getAuthHeader(auth.accessToken),
                body:JSON.stringify(payload)
            },setAuth, navigate)

            const data = await response.json()
            setMessageType(data.type)
            setMessage(data.message)
            console.log(data);
            if(response.status == 401){
                navigate("/login")
                return
            }
            if(data.type === "success") navigate("/dashboard")
        } catch (error) {
            setMessage("Something Went Wrong")
        } finally{
            setLoading(false)
        }
    }

  return (
    <div className="create-coupon">
        <h1>Create Coupon</h1>
        <form onSubmit={handleSubmit} className="coupon-form">


                <div className="form-group">
                    <label htmlFor="discountType">Discount Type</label>
                    <select name="discountType" id="discountType" value={formData.discountType} onChange={handleChange}>
                        <option value="flat">Flat</option>
                        <option value="service">Service based</option>
                    </select>
                </div>

                <div className="form-group">
                    <label htmlFor="discountValue">Discount Value (% OR Rs.)</label>
                    <input type="text" name="discountValue" id="discountValue" onChange={handleChange} />
                </div>

                <div className="form-group">
                    <label htmlFor="quantity">Quantity</label>
                    <input type="number" name="quantity" id="quantity" min={1} onChange={handleChange} />
                </div>

                <div className="form-group">
                    <label htmlFor="validFrom">Valid From</label>
                    <input type="date" name="validFrom" id="validFrom" onChange={handleChange} />
                </div>

                <div className="form-group">
                    <label htmlFor="validTo">Valid To</label>
                    <input type="date" name="validTo" id="validTo" onChange={handleChange} />
                </div>

                <div className="form-group">
                    <label htmlFor="quantity">Sponsored Name</label>
                    <input type="text" name="sponsoredName" id="sponsoredName" onChange={handleChange} />
                </div>

                <div className="form-group">
                    <label htmlFor="quantity">Token Sequence</label>
                    <input type="text" name="tokenSequence" id="tokenSequence" onChange={handleChange} />
                </div>
                
                {formData.discountType === "service" && (
                    <div className="form-group">
                        <label htmlFor="services">Service (comma separated)</label>
                        <textarea name="services" id="services" placeholder="ECG, Blood Test, X-ray" onChange={handleChange} />
                    </div>
                )}
            <button className="submit-btn" disabled={loading}> {loading? <span className="spinner"></span> : "Create"} </button>
        </form>
        {message && <p className={messageType === "success"? "success" : "error"}>{message}</p>}
    </div>
  )
}

export default CreateCoupons