import { useEffect, useState } from "react"
import { QRCodeCanvas } from "qrcode.react"
import { useNavigate } from "react-router"
import getAuthHeader from "../components/GetAuthHeader"
import { API_BASE_URL } from "../config"
import "../style/Dashboard.css"

const Dashboard = () => {
  const navigate = useNavigate()

  // const [message, setMessage] = useState(null)
  const [coupons, setCoupons] = useState([])
  const [status, setStatus] = useState("all")
  const [loading, setLoading] = useState(false)
  const [cancelSponsoredCoupons, setCancelSponsoredCoupons] = useState("")
  const [searchSponsoredName, setSearchSponsoredName] = useState("")

  useEffect(() => {
    fetchCoupons(status)
  }, [status])


  function getStatus(coupon) {
    if (coupon.isCancelled) return "cancelled"
    if (coupon.isUsed) return "used"
    if (new Date(coupon.validTo) < new Date()) return "expired"
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

      if (res.status == 401) {
        navigate("/login")
        return
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  async function cancelCoupon(secret) {
    if (!window.confirm(`Cancel coupon ${secret}?`)) return

    const res = await fetch(`${API_BASE_URL}/coupons/cancel`, {
      method: "POST",
      headers: getAuthHeader(),
      body: JSON.stringify({ secret })
    })
    const data = await res.json()
    // setMessage(data.message)
    if (res.status == 401) {
      navigate("/login")
      return
    }
    fetchCoupons(status)
  }

  async function cancelSponsoredCouponsFunction() {
    if (!cancelSponsoredCoupons) return alert("Enter sponsored name")

    if (!window.confirm(`Cancel all coupons of ${cancelSponsoredCoupons}?`)) return

    const res = await fetch(`${API_BASE_URL}/coupons/cancel`, {
      method: "POST",
      headers: getAuthHeader(),
      body: JSON.stringify({ sponsoredName: cancelSponsoredCoupons })
    })
    const data = await res.json()
    // setMessage(data.message)
    if (res.status == 401) {
      navigate("/login")
      return
    }
    alert(data.message)
    setCancelArea("")
    fetchCoupons(status)
  }

  async function searchSponsoredNameFunction() {
    try {
      const res = await fetch(`${API_BASE_URL}/coupons/searchBySponsoredName`, {
        method: "POST",
        headers: getAuthHeader(),
        body: JSON.stringify({ searchBySponsoredName: searchSponsoredName, status: status })
      })
      const data = await res.json()
      if (!res.ok) {
        alert(data.message)
        return
      }
      if (!data.couponsBySponsoredName) return alert(data.message)
      setCoupons(data.couponsBySponsoredName)
    } catch (err) {
      console.log("Catch Error", err);

    }
  }

  return (
    <>
      <div className="container">
        <h1>Dashboard</h1>
        <p>Manage coupons and their status</p>
      </div>

      <div className="filters">
        <div className="filter-group">
          <input
            value={cancelSponsoredCoupons}
            onChange={(e) => setCancelSponsoredCoupons(e.target.value)}
            placeholder="Enter sponsored name to cancel"
          />
          <button onClick={cancelSponsoredCouponsFunction} className="danger">
            Cancel
          </button>
        </div>

        <div className="filter-group">
          <input
            placeholder="Search sponsored name"
            value={searchSponsoredName}
            onChange={(e) => setSearchSponsoredName(e.target.value)}
          />
          <button onClick={searchSponsoredNameFunction}>
            Search
          </button>
        </div>

        <div className="filter-group">
          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="all">All</option>
            <option value="active">Active</option>
            <option value="expired">Expired</option>
            <option value="cancelled">Cancelled</option>
            <option value="used">Used</option>
          </select>
        </div>
      </div>


      <div className="table-container">
        <div className="table-wrapper">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <table className="dashboard-table">
              <thead>
                <tr>
                  {/* <th>ID</th> */}
                  <th>Token</th>
                  <th>Secret</th>
                  <th>Discount Type</th>
                  <th>Discount</th>
                  <th>Services</th>
                  <th>Sponsored Name</th>
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
                    {/* <td>{coupon._id}</td> */}
                    <td>{coupon.token}</td>
                    <td>{coupon.secret}</td>
                    <td>{coupon.discountType}</td>
                    <td>{coupon.discountValue}</td>
                    <td>{coupon.discountType === "service" ? (
                      <ul style={{ paddingLeft: "16px" }}>
                        {coupon.services.map((service, index) => (
                          <li key={index}>{service}</li>
                        ))}
                      </ul>
                    ) : (
                      "-"
                    )}
                    </td>
                    <td>{coupon.sponsoredName}</td>
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
                    <td>
                      <button disabled={getStatus(coupon) !== "active"}
                        onClick={() => cancelCoupon(coupon.secret)}
                      >Cancel</button>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </>
  )
}

export default Dashboard