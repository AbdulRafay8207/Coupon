import { useState } from "react"
import { useNavigate } from "react-router"
import getAuthHeader from "../components/GetAuthHeader"
import { API_BASE_URL } from "../config"

const CreateCoupons = () => {
    const navigate = useNavigate()
    const [formData, setFormData] = useState({
        discountValue: "",
        area: "",
        validFrom:"",
        validTo:"",
        discountType: "flat",
        services: "",
        quantity: 1
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
    <div>
        <h1>Create Coupon</h1>
        <form onSubmit={handleSubmit}>

                <label htmlFor="discountType">Discount Type</label>
                <select name="discountType" id="discountType" value={formData.discountType} onChange={handleChange}>
                    <option value="flat">Flat</option>
                    <option value="service">Service based</option>
                </select>
            
                <label htmlFor="discountValue">Discount Value (%)</label>
                <input type="text" name="discountValue" id="discountValue" onChange={handleChange} />
          
                <label htmlFor="area">Area</label>
                <input type="text" name="area" id="area" onChange={handleChange} />
         
                <label htmlFor="validFrom">Valid From</label>
                <input type="date" name="validFrom" id="validFrom" onChange={handleChange} />

                <label htmlFor="validTo">Valid To</label>
                <input type="date" name="validTo" id="validTo" onChange={handleChange} />

                {formData.discountType === "service" && (
                    <>
                    <label htmlFor="services">Service (comma separated)</label>
                    <textarea name="services" id="services" placeholder="ECG, Blood Test, X-ray" onChange={handleChange} />
                    </>
                )}

                <label htmlFor="quantity">Quantity</label>
                <input type="number" name="quantity" id="quantity" min={1} onChange={handleChange} />
 
            <button>Create Coupon</button>
        </form>
        {message && <p>{message}</p>}
        <p>{JSON.stringify(formData, null, 2)}</p>
    </div>
  )
}

export default CreateCoupons