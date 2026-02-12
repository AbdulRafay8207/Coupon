import { useEffect, useState } from "react"
import { QRCodeCanvas } from "qrcode.react"
import { useNavigate, useParams } from "react-router"
import getAuthHeader from "../components/GetAuthHeader"
import { API_BASE_URL } from "../config"
import "../style/Dashboard.css"
import FixGrammer from "../components/FixGrammer"

const SponsoredDetails = () => {
  const navigate = useNavigate()
  const { sponsoredName } = useParams()

  const [message, setMessage] = useState("")
  const [coupons, setCoupons] = useState([])
  const [status, setStatus] = useState("all")
  const [loading, setLoading] = useState(false)
  const [findCoupon, setFindCoupon] = useState("")

  useEffect(() => {
    const delay = setTimeout(() => {
      fetchCoupons(status, findCoupon)
    }, 400)

    return () => clearTimeout(delay)
  }, [status, sponsoredName, findCoupon])

  function getStatus(coupon) {
    if (coupon.isCancelled) return "cancelled"
    if (coupon.isUsed) return "used"
    if (new Date(coupon.validTo) < new Date()) return "expired"
    return "active"
  }

  async function fetchCoupons(type, search = "") {
    setLoading(true)
    try {
      const res = await fetch(
        `${API_BASE_URL}/coupons/sponsored-details?sponsoredName=${sponsoredName}&type=${type}&search=${search}`,
        {
          headers: getAuthHeader()
        }
      )

      const data = await res.json()
      setMessage(data.message)
      setCoupons(data.sponsoredDetails || [])
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

    if (res.status === 401) {
      navigate("/login")
      return
    }

    fetchCoupons(status, findCoupon)
  }

  return (
    <>
      <div className="container">
        <h1>{FixGrammer(sponsoredName)} Coupons</h1>
        <p>Manage coupons and their status</p>
      </div>

      <div className="filters">
        <div className="filter-group">
          <input
            placeholder="Search Coupon by Secret"
            value={findCoupon}
            onChange={(e) => setFindCoupon(e.target.value)}
          />

          {/* Optional Clear Button */}
          {findCoupon && (
            <button
              className="find-btn"
              onClick={() => setFindCoupon("")}
            >
              Clear
            </button>
          )}
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

        <div className="btns-container">
          <button
            className="print-layout-btn"
            onClick={() =>
              navigate(`/sponsored-details/${sponsoredName}/print`, {
                state: { coupons, sponsoredName }
              })
            }
          >
            Print Layout
          </button>
        </div>
      </div>

      <div className="table-container">
        <div className="table-wrapper">
          <table className="dashboard-table">
            <thead>
              <tr>
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
              {loading ? (
                <tr>
                  <td colSpan="11" style={{ textAlign: "center" }}>
                    Loading...
                  </td>
                </tr>
              ) : coupons.length === 0 ? (
                <tr>
                  <td colSpan="11" style={{ textAlign: "center" }}>
                    No coupon found
                  </td>
                </tr>
              ) : (
                coupons.map((coupon) => (
                  <tr key={coupon._id}>
                    <td>{coupon.token}</td>
                    <td>{coupon.secret}</td>
                    <td>{coupon.discountType}</td>
                    <td>{coupon.discountValue}</td>
                    <td>
                      {coupon.discountType === "service" ? (
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
                    <td>{new Date(coupon.validFrom).toLocaleDateString()}</td>
                    <td>{new Date(coupon.validTo).toLocaleDateString()}</td>
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
                      <button
                        disabled={getStatus(coupon) !== "active"}
                        onClick={() => cancelCoupon(coupon.secret)}
                      >
                        Cancel
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}

export default SponsoredDetails
