import { useEffect, useState } from "react"
import { QRCodeCanvas } from "qrcode.react"
import { useNavigate } from "react-router"
import getAuthHeader from "../components/GetAuthHeader"

const Dashboard = () => {
  const navigate = useNavigate()

  // const [message, setMessage] = useState(null)
  const [coupons, setCoupons] = useState([])
  const [status, setStatus] = useState("all")
  const [loading, setLoading] = useState(false)
  const [cancelArea, setCancelArea] = useState("")

  useEffect(() => {
    fetchCoupons(status)
  }, [status])


  function getStatus(coupon){
    if(coupon.isCancelled) return "Cancelled"
    if(coupon.isUsed) return "Used"
    if(new Date(coupon.validTo) < new Date()) return "Expired"
    return "Active"
  }

  async function fetchCoupons(type) {
    setLoading(true)
    try {
      const res = await fetch(
        `http://localhost:8000/coupons/status?type=${type}`,
        {
          headers: getAuthHeader()
        },
      )
      const data = await res.json()
      // setMessage(data.message)
      setCoupons(data.coupon || [])
      
      if(res.status == 401){
        navigate("/login")
        return
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  async function cancelCard(token) {
    if (!window.confirm(`Cancel coupon ${token}?`)) return

    const res = await fetch("http://localhost:8000/coupons/cancel", {
      method: "POST",
      headers: getAuthHeader(),
      body: JSON.stringify({ token })
    })
    const data = await res.json()
    // setMessage(data.message)
    if(res.status == 401){
        navigate("/login")
        return
      }
    fetchCoupons(status)
  }

  async function cancelAreaCards() {
    if (!cancelArea) return alert("Enter area")

    if (!window.confirm(`Cancel all coupons in ${cancelArea}?`)) return

    const res = await fetch("http://localhost:8000/coupons/cancel", {
      method: "POST",
      headers: getAuthHeader(),
      body: JSON.stringify({ area: cancelArea })
    })


    const data = await res.json()
    // setMessage(data.message)
    if(res.status == 401){
        navigate("/login")
        return
      }
    alert(data.message)
    setCancelArea("")
    fetchCoupons(status)
  }

  return (
    <div>
      <h1>Dashboard</h1>

      {/* Cancel by Area */}
      <div style={{ marginBottom: 10 }}>
        <input
          value={cancelArea}
          onChange={(e) => setCancelArea(e.target.value)}
          placeholder="Enter area"
        />
        <button onClick={cancelAreaCards}>Cancel Area</button>
      </div>

      {/* Status Filters */}
      <select value={status} onChange={(e)=> setStatus(e.target.value)}>
        <option value="all">All</option>
        <option value="active">Active</option>
        <option value="expired">Expired</option>
        <option value="cancelled">Cancelled</option>
        <option value="used">Used</option>

      </select>

      <h3>
        Showing {status.toUpperCase()} Coupons: {coupons?.length || 0}
      </h3>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <table border={1} cellPadding={5}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Token</th>
              <th>Secret</th>
              <th>Discount</th>
              <th>Area</th>
              <th>Valid From</th>
              <th>Valid To</th>
              <th>Status</th>
              <th>QR</th>
              {status !== "expired" && status !== "cancelled" && status !== "used" && (<th>Action</th>)}
            </tr>
          </thead>
          <tbody>
            {coupons.map((coupon) => (
              <tr key={coupon._id}>
                <td>{coupon._id}</td>
                <td>{coupon.token}</td>
                <td>{coupon.secret}</td>
                <td>{coupon.discountValue}</td>
                <td>{coupon.area}</td>
                <td>{coupon.validFrom}</td>
                <td>{coupon.validTo}</td>
                <td>{getStatus(coupon)}</td>
                <td>
                  <QRCodeCanvas
                    size={80}
                    value={JSON.stringify({
                      id: coupon._id,
                      token: coupon.token,
                      secret: coupon.secret
                    })}
                  />
                </td>
                  {/* {getStatus(coupon) === "Active" && (
                    <td>
                      <button onClick={() => cancelCard(coupon.token)}>
                       Cancel
                      </button>
                    </td>
                  )} */}
                  <td>
                    <button disabled={getStatus(coupon) !== "Active"} onClick={() => cancelCard(coupon.token)}>Cancel</button>
                  </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}

export default Dashboard