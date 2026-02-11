import { useEffect, useState } from "react"
import { Html5QrcodeScanner } from "html5-qrcode";
import getAuthHeader from "../components/GetAuthHeader"
import { API_BASE_URL } from "../config";
// import { QrReader } from "react-qr-reader";
import "../style/validate.css"


const ValidateCard = () => {
  const [qrInput, setQrInput] = useState("")
  const [secret, setSecret] = useState("")
  const [result, setResult] = useState("")
  const [loading, setLoading] = useState(false)
  const [discount, setDiscount] = useState(null)
  const [messageType, setMessageType] = useState("")

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
          console.log("Data",parsed);


          const response = await fetch(
            `${API_BASE_URL}/coupons/validate`,
            {
              method: "POST",
              headers: getAuthHeader(),
              body: JSON.stringify(parsed)
            }
          );
          console.log("Data",parsed);
          

          const data = await response.json();
          setResult(data.message);
          setDiscount(data.discountValue || null);
          setMessageType(data.type)

          scanner.clear(); // stop scanning after success
        } catch (err) {
          setResult("Invalid QR code");
          console.log("error in qr reader catch",err);
          
        }
      },
      (error) => {
        // ignore scan errors
      }
    );

    return () => {
      scanner.clear().catch(() => { });
    };
  }, []);

  async function validateBySecret() {
      setLoading(true )
    try {
      const response = await fetch(`${API_BASE_URL}/coupons/validate`, {
        method: "POST",
        headers: getAuthHeader(),
        body: JSON.stringify({ secret })
      })
      const data = await response.json()
      setResult(data.message)
      setMessageType(data.type)
      setDiscount(data.discountValue || null);
  
      if (response.status == 401) {
        navigate("/login")
        return
      }
    } catch (error) {
      console.log("error in validateBySecret",error);
    } finally{
      setLoading(false)
    }
  }

  return (
    <div className="validate-page">
      <h1>ValidateCoupon</h1>

      <div className="validate-grid">
        <div className="validate-card">
          <h3>Scan QR</h3>
          <div id="reader" className="qr-reader" />
        </div>

        <div className="validate-card">
          <h3>Manual Token</h3>

          {/* <br /> */}
          <div className="form-group">
            <label>Secret</label>
            <input type="text" placeholder="Enter Secret" value={secret} onChange={(e) => setSecret(e.target.value)} />
          </div>
          {/* <br /> */}

          <button className="submit-btn" onClick={validateBySecret}>{loading ? <span className="spinner"></span> : "Validate QR"}</button>
        </div>
      </div>

      <div className="result-box">
        <h3>RESULT</h3>
        <p className={messageType === "success"? "success" : "error"}>{result}</p>
        {discount && <p className={messageType === "success"? "success" : "error"}><strong>Discount:</strong> {discount}</p>}
      </div>
    </div>
  )
}

export default ValidateCard