import { useState } from "react"

const CreateCoupons = () => {
    const [formData, setFormData] = useState({
        discountValue: "",
        area: "",
        validFrom:"",
        validTo:""
    })
    const [message, setMessage] = useState("")
    const handleChange = (e)=>{
        const {name, value} = e.target
        setFormData({...formData,[name]:value})
    }
    const handleSubmit = async (e)=>{
        e.preventDefault()
        try{
            const response = await fetch("http://localhost:8000/coupons/create", {
                method: "POST",
                headers:{
                    "Content-Type":"application/json"
                },
                body:JSON.stringify(formData)
            })
            const data = await response.json()
            setMessage(data.message)
            console.log(data);
        }catch(error){
            console.error("error",error)
        }
    }
  return (
    <div>
        <h1>Create Coupon</h1>
        <form onSubmit={handleSubmit}>
            <div>
                <label htmlFor="discountValue">Discount Value (%)</label>
                <input type="number" name="discountValue" id="discountValue" onChange={handleChange} />
            </div>
            <div>
                <label htmlFor="area">Area</label>
                <input type="text" name="area" id="area" onChange={handleChange} />
            </div>
            <div>
                <label htmlFor="validFrom">Valid From</label>
                <input type="date" name="validFrom" id="validFrom" onChange={handleChange} />
            </div>
            <div>
                <label htmlFor="validTo">Valid To</label>
                <input type="date" name="validTo" id="validTo" onChange={handleChange} />
            </div>
            <button>Create Coupon</button>
        </form>
        {message && <p>{message}</p>}
        <p>{JSON.stringify(formData, null, 2)}</p>
    </div>
  )
}

export default CreateCoupons