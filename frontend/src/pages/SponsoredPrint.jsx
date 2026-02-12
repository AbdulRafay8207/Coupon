import { useEffect, useState } from "react"
import { useParams } from "react-router"
import { QRCodeCanvas } from "qrcode.react"
import getAuthHeader from "../components/GetAuthHeader"
import "../style/SponsoredPrint.css"

const SponsoredPrint = () => {
  const { sponsoredName } = useParams()
  const [coupons, setCoupons] = useState([])

  useEffect(() => {
    fetchCoupons()
  }, [sponsoredName])

  async function fetchCoupons() {
    const res = await fetch(
      `${import.meta.env.VITE_API_URL}/coupons/sponsored-details?sponsoredName=${sponsoredName}&type=all`,
      { headers: getAuthHeader() }
    )
    const data = await res.json()
    setCoupons(data.sponsoredDetails || [])
  }

  return (
    <div className="print-page">
      {/* Header */}
      <div className="print-header">
        <h1>{sponsoredName} Coupons</h1>
        <button className="no-print" onClick={() => window.print()}>
          Print
        </button>
      </div>

      {/* Coupons */}
      <div className="coupon-grid">
        {coupons.map((coupon) => (
          <div key={coupon._id} className="coupon-card">
            <h3>{coupon.token}</h3>

            <p><strong>Discount Type:</strong> {coupon.discountType}</p>
            <p><strong>Discount:</strong> {coupon.discountValue}</p>

            {coupon.discountType === "service" && (
              <p>
                <strong>Services:</strong>{" "}
                {coupon.services.join(", ")}
              </p>
            )}

            <p>
              <strong>Valid:</strong>{" "}
              {new Date(coupon.validFrom).toLocaleDateString()} –{" "}
              {new Date(coupon.validTo).toLocaleDateString()}
            </p>

            <div className="qr">
              <QRCodeCanvas
                size={90}
                value={JSON.stringify({
                  id: coupon._id,
                  token: coupon.token,
                  secret: coupon.secret
                })}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default SponsoredPrint
