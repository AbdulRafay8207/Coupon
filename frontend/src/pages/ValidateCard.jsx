import { useEffect, useState } from "react"
import { Html5QrcodeScanner } from "html5-qrcode";
import getAuthHeader from "../components/GetAuthHeader"
import { API_BASE_URL } from "../config";
// import { QrReader } from "react-qr-reader";


const ValidateCard = () => {
    const [qrInput, setQrInput] = useState("")
    const [token, setToken] = useState("")
    const [secret, setSecret] = useState("")
    const [result, setResult] = useState("")
    const [loading, setLoading] = useState(false)
    const [discount, setDiscount] = useState(null)

    useEffect(() => {
    const scanner = new Html5QrcodeScanner(
      "reader",
      {
        fps: 10,
        qrbox: 250
      },
      false
    );

    scanner.render(
      async (decodedText) => {
        try {
          const parsed = JSON.parse(decodedText);

          const response = await fetch(
            `${API_BASE_URL}/coupons/validate`,
            {
              method: "POST",
              headers: getAuthHeader(),
              body: JSON.stringify(parsed)
            }
          );

          const data = await response.json();
          setResult(data.message);
          setDiscount(data.discountValue || null);

          scanner.clear(); // stop scanning after success
        } catch (err) {
          setResult("Invalid QR code");
        }
      },
      (error) => {
        // ignore scan errors
      }
    );

    return () => {
      scanner.clear().catch(() => {});
    };
  }, []);

async function validateByQR(){
    try{
        setLoading(true)
        const parsed = JSON.parse(qrInput)
        const response = await fetch(`${API_BASE_URL}/coupons/validate`,{
            method: "POST",
            headers: getAuthHeader(),
            body: JSON.stringify(parsed)
        })
        const data = await response.json()
        setResult(data.message)
        setDiscount(data.discount || null)
        if(response.status == 401){
        navigate("/login")
        return
      }

    }catch(err){
        setResult("Invalid QR data")
    }finally{
        setLoading(false)
    }
}

async function validateByToken(){
    const response = await fetch(`${API_BASE_URL}/coupons/validate`,{
        method: "POST",
        headers: getAuthHeader(),
        body: JSON.stringify({token, secret})
    })
    const data = await response.json()
    setResult(data.message)
    if(response.status == 401){
        navigate("/login")
        return
      }
}

    return (
        <div>
        <h1>ValidateCoupon</h1>
        <h3>Scan QR</h3>

        {/* <textarea
        rows="5"
        placeholder="Past scanned QR data"
        value={qrInput}
        onChange={(e)=> setQrInput(e.target.value)}
        />
        <br/>
        <button onClick={validateByQR}>Validate QR</button>
        <br />*/} 
        <div> 
      <div id="reader" style={{ width: "300px" }} />

      {/* <h3>Result</h3>
      <p>{result}</p> */}
      {discount && <p><strong>Discount:</strong> {discount}</p>}
    </div>

        <h3>Manual Token</h3>
        <input type="text" placeholder="Enter Token" value={token} onChange={(e)=> setToken(e.target.value)} />
        <br />
        <input type="text" placeholder="Enter Secret" value={secret} onChange={(e)=> setSecret(e.target.value)} />
        <br />
        <button onClick={validateByToken}>{loading? "Validating...": "Validate QR"}</button>

        <h3>RESULT</h3>
        <p>{result}</p>
        {discount && <p><strong>Discount:</strong> {discount}</p>}
    </div>
  )
}

export default ValidateCard