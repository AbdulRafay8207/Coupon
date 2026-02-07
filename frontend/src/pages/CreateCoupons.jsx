import { useState } from "react"
import { useNavigate } from "react-router"
import getAuthHeader from "../components/GetAuthHeader"
import { API_BASE_URL } from "../config"
import "../style/CreateCoupons.css"

const CreateCoupons = () => {
    const navigate = useNavigate()
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

    const handleChange = (e)=>{
        const {name, value} = e.target
        // console.log("name",name,"value",value);
        
        setFormData({...formData,[name]:value})
    }
    
    const handleSubmit = async (e)=>{
        e.preventDefault()

        const payload = {
            ...formData,
            services: formData.discountType === "service"? formData.services.split(",").map(s => s.trim()) : []
        }
        console.log(payload.services);
        
        
            const response = await fetch(`${API_BASE_URL}/coupons/create`, {
                method: "POST",
                headers: getAuthHeader(),
                body:JSON.stringify(payload)
            })

            const data = await response.json()
            setMessage(data.message)
            console.log(data);
            if(response.status == 401){
                navigate("/login")
                return
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
                    <label htmlFor="discountValue">Discount Value (%)</label>
                    <input type="text" name="discountValue" id="discountValue" onChange={handleChange} />
                </div>
                
                {/* <div className="form-group">
                    <label htmlFor="area">Area</label>
                    <input type="text" name="area" id="area" onChange={handleChange} />
                </div> */}

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
                    <label htmlFor="quantity">sponsored Name</label>
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
            <button className="submit-btn">Create Coupon</button>
        </form>
        {message && <p className={message === "Successfully created"? "success" : ""}>{message}</p>}
    </div>
  )
}

export default CreateCoupons