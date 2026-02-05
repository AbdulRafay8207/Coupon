import { useEffect, useState } from "react"
import { QRCodeCanvas } from "qrcode.react"
import { useNavigate } from "react-router"
import getAuthHeader from "../components/GetAuthHeader"
import { API_BASE_URL } from "../config"

const Dashboard = () => {
  const navigate = useNavigate()

  // const [message, setMessage] = useState(null)
  const [coupons, setCoupons] = useState([])
  const [status, setStatus] = useState("all")
  const [loading, setLoading] = useState(false)
  const [cancelArea, setCancelArea] = useState("")
  const [searchArea, setSearchArea] = useState("")

  useEffect(() => {
    fetchCoupons(status)
  }, [status])


  function getStatus(coupon){
    if(coupon.isCancelled) return "cancelled"
    if(coupon.isUsed) return "used"
    if(new Date(coupon.validTo) < new Date()) return "expired"
    return "active"
  }

  async function fetchCoupons(type) {
    setLoading(true)
    try {
      const res = await fetch(
        `${API_BASE_URL}/coupons/status?type=${type}`,
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

    const res = await fetch(`${API_BASE_URL}/coupons/cancel`, {
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

    const res = await fetch(`${API_BASE_URL}/coupons/cancel`, {
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

  async function searchAreaFunction(){    
      try {
        const res = await fetch(`${API_BASE_URL}/coupons/searchByArea`,{
        method: "POST",
        headers: getAuthHeader(),
        body: JSON.stringify({searchByArea: searchArea, status: status})
      })
      const data = await res.json()
      if (!res.ok) {
      alert(data.message)
      return
    }
      if(!data.couponsByArea) return alert(data.message)
      setCoupons(data.couponsByArea)
    }catch(err){
      console.log("Catch Error",err);
      
    }
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

      {/* Search By Area */}
      <div>
        <input placeholder="Search Area" value={searchArea} onChange={(e) => setSearchArea(e.target.value)} />
        <button onClick={searchAreaFunction}>Search Area</button>
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
              <th>Discount Type</th>
              <th>Discount</th>
              <th>Services</th>
              <th>Area</th>
              <th>Valid From</th>
              <th>Valid To</th>
              <th>Status</th>
              <th>QR</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {coupons.map((coupon) => (
              <tr key={coupon._id}>
                <td>{coupon._id}</td>
                <td>{coupon.token}</td>
                <td>{coupon.secret}</td>
                <td>{coupon.discountType}</td>
                <td>{coupon.discountValue}</td>
                <td>{coupon.discountType === "service"? (
                  <ul style={{paddingLeft:"16px"}}>
                    {coupon.services.map((service,index)=>(
                      <li key={index}>{service}</li>
                    ))}
                  </ul>
                ) : <span style={{paddingLeft: "43px"}}>-</span>}</td>
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
                    <button disabled={getStatus(coupon) !== "active"}
                     onClick={() => cancelCard(coupon.token)}
                     style={{
                      cursor: getStatus(coupon) !== "active" ? "not-allowed" : "pointer",
                      opacity: getStatus(coupon) !== "active" ? 0.6 : 1,
                      backgroundColor: getStatus(coupon) !== "active" ? "#ccc" : "#ff4d4f",
                      color: getStatus(coupon) !== "active" ? "#666" : "#fff"
                      }}
                    >Cancel</button>
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