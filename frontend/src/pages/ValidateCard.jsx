import { useState } from "react"
// import { QrReader } from "react-qr-reader";


const ValidateCard = () => {
    const [qrInput, setQrInput] = useState("")
    const [token, setToken] = useState("")
    const [secret, setSecret] = useState("")
    const [result, setResult] = useState("")
    const [loading, setLoading] = useState(false)
    const [discount, setDiscount] = useState(null)

async function validateByQR(){
    try{
        setLoading(true)
        const parsed = JSON.parse(qrInput)
        const response = await fetch("http://localhost:8000/coupons/validate",{
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(parsed)
        })
        const data = await response.json()
        setResult(data.message)
        setDiscount(data.discount || null)

    }catch(err){
        setResult("Invalid QR data")
    }finally{
        setLoading(false)
    }
}

async function validateByToken(){
    const response = await fetch("http://localhost:8000/coupons/validate",{
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({token, secret})
    })
    const data = await response.json()
    setResult(data.message)
}

    return (
        <div>
        <h1>ValidateCoupon</h1>
        <h3>Scan QR</h3>
        {/* <QrReader onResult={(result,error)=>{
            if(!!result){
                setQrInput(result?.text)
                validateByQR(result?.text)
            }
            if(!!error){
                console.log(error);
            }
        }}
            constraints={{ facingMode: "environment" }}
            style={{ width: "300px" }}
        /> */}

        <textarea
        rows="5"
        placeholder="Past scanned QR data"
        value={qrInput}
        onChange={(e)=> setQrInput(e.target.value)}
        />
        <br/>
        <button onClick={validateByQR}>Validate QR</button>
        <br />

        <h3>Manual Token</h3>
        <input type="text" placeholder="Enter Token" value={token} onChange={(e)=> setToken(e.target.value)} />
        <br />
        <input type="text" placeholder="Enter Secret" value={secret} onChange={(e)=> setSecret(e.target.value)} />
        <br />
        <button onClick={validateByToken}>{loading? "Validating...": "Validate QR"}</button>

        <h3>RESULT</h3>
        <p>{result}</p>
        {discount && <p><Strong>Discount:</Strong> {discount}</p>}
    </div>
  )
}

export default ValidateCard