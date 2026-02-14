import { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import getAuthHeader from "../components/GetAuthHeader";
import "../style/validate.css";

const ValidateCard = () => {
  const qrRef = useRef(null);
  const scannerRef = useRef(null);

  const [secret, setSecret] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [loading, setLoading] = useState(false);
  const [scannedQrData, setScannedQrData] = useState('')

  const [borderState, setBorderState] = useState("idle"); 
  // idle | detecting | success | error

  // ---------------- VALIDATE COUPON ----------------
  async function validateCoupon(payload) {
    setLoading(true);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/coupons/validate`,
        {
          method: "POST",
          headers: getAuthHeader(),
          body: JSON.stringify(payload)
        }
      );

      const data = await response.json();
      setMessage(data.message);
      setMessageType(data.type);
      setBorderState(data.type === "success" ? "success" : "error");
      setScannedQrData(data.scannedCoupon)
      stopScanner();
    } catch {
      setMessage("Something went wrong");
      setMessageType("error");
      setBorderState("error");
    } finally {
      setLoading(false);
    }
  }

  // ---------------- START SCANNER ----------------
  async function startScanner() {
    if (scannerRef.current) return;

    const html5QrCode = new Html5Qrcode("reader");
    scannerRef.current = html5QrCode;

    setBorderState("idle");

    await html5QrCode.start(
      { facingMode: "environment" },
      { fps: 10, qrbox: 250 },
      async (decodedText) => {
        setBorderState("detecting");

        try {
          const parsed = JSON.parse(decodedText);
          await validateCoupon(parsed);
        } catch {
          setBorderState("error");
        }
      }
    );
  }

  // ---------------- STOP SCANNER ----------------
  async function stopScanner() {
    if (scannerRef.current) {
      await scannerRef.current.stop();
      await scannerRef.current.clear();
      scannerRef.current = null;
    }
  }

  // ---------------- RESET ----------------
  async function resetScanner() {
    setMessage("");
    setMessageType("");
    setBorderState("idle");
    await startScanner();
  }

  useEffect(() => {
    startScanner();
    return () => stopScanner();
  }, []);


  async function redeemCoupon() {
    console.log("check");
    
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/coupons/redeem`,{
        method: "POST",
        headers: getAuthHeader(),
        body: JSON.stringify({id: scannedQrData._id})
      })
      const data = await response.json()
      setMessageType(data.type)
      setMessage(data.message)
      if(data.type === "success"){
        setScannedQrData((prev) => ({
          ...prev, isUsed: true
        }))
      }
      if(data.type === "error") return alert(data.message)

    } catch (error) {
      console.log("Something wrong in redeemCoupon function", error);
    }
  }

  return (
    <div className="validate-page">
      <h1>Validate Coupon</h1>

      <div className="validate-grid">
        {/* QR SCANNER */}
        <div className="validate-card">
          <h3>Scan QR</h3>

          <div >
            <div id="reader" ref={qrRef} />
          </div>

          {loading && <p>Validating...</p>}

          {(borderState === "success" || borderState === "error") && (
            <button className="submit-btn" onClick={resetScanner}>
              Scan Again
            </button>
          )}
        </div>

        {/* MANUAL */}
        <div className="validate-card">
          <h3>Manual Token</h3>

          <div className="form-group">
            {/* <label>Secret</label> */}
            <input
              value={secret}
              onChange={(e) => setSecret(e.target.value)}
              placeholder="Enter Secret"
            />
          </div>

          <button
            className="submit-btn"
            disabled={loading || !secret}
            onClick={() => validateCoupon({ secret })}
          >
            {loading ? <span className="spinner" /> : "Validate"}
          </button>
        </div>
      </div>

      <div className="result-box">
        <h3>RESULT</h3>
        <p className={messageType === "success" ? "success" : "error"}>
          {message}
        </p>
        {/* {discount && <p className="success"><b>Discount:</b> {discount}</p>}*/}
        {scannedQrData && (
          <div className="coupon-preview">
            <h3>Coupon Details</h3>
            <div className="var-val-container">
            <p><b>Token:</b> {scannedQrData.token}</p>
            <p><b>Secret:</b> {scannedQrData.secret}</p>
            <p><b>Discount Type:</b> {scannedQrData.discountType}</p>
            <p><b>Discount Value:</b> {scannedQrData.discountValue}</p>
            {scannedQrData.services.length > 0? <p><b>Servies:</b> {scannedQrData.services.join(", ")}</p> : ""}
            <p><b>Valid:</b> {new Date(scannedQrData.validFrom).toLocaleDateString()} {"-"} {new Date(scannedQrData.validTo).toLocaleDateString()}</p>
            <p><b>Status:</b> {scannedQrData.isUsed === true? "Used" : scannedQrData.isCancelled === true? "Cancelled" : new Date(scannedQrData.validTo) < new Date()? "Expired" : "Active"}</p>
            <p><b>Sponsored By:</b> {scannedQrData.sponsoredName}</p>
            <button className="redeem-btn" disabled={scannedQrData.isUsed} onClick={redeemCoupon}>Redeem</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ValidateCard;
