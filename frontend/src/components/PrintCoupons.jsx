import { forwardRef } from "react"
import { QRCodeCanvas } from "qrcode.react"
import "../style/PrintCoupons.css"
import logo from "../assets/logo2.png"
import FixGrammer from "./FixGrammer"


/*
  forwardRef is REQUIRED
  because react-to-print needs access to DOM node
*/
const PrintCoupons = forwardRef(({ coupons, sponsoredName }, ref) => {
  return (
    <div ref={ref} className="print-wrapper">
      <h1 className="print-title">{FixGrammer(sponsoredName)} Coupons</h1>

      <div className="coupon-grid">
        {coupons.map((coupon) => (
          <div key={coupon._id} className="coupon-card">

            <div className="coupon-sponsored">
              Sponsored by: {coupon.sponsoredName}
            </div>

            <div className="coupon-info">
              <div className="logo-container">
                <img className="img-logo" src="https://baitussalam.org/images/logo-2.svg" alt={logo} srcset="" />
              </div>

              <h3>{coupon.token}</h3>

              {coupon.discountType === "flat" && (
                <p>
                  <b>Discount:</b> FLAT {coupon.discountValue}
                </p>
              )}

              {coupon.discountType === "service" && (
                <>
                  <p>
                    <b>Discount:</b> {coupon.discountValue}
                  </p>

                  <p>
                    <b>Services:</b> {coupon.services.join(", ")}
                  </p>
                </>
              )}

              <p>
                <b>Valid:</b>{" "}
                {new Date(coupon.validFrom).toLocaleDateString()} –{" "}
                {new Date(coupon.validTo).toLocaleDateString()}
              </p>
            </div>

            <div className="coupon-qr">
              <QRCodeCanvas value={coupon.secret} size={100} />
              <div className="coupon-secret">{coupon.secret}</div>
            </div>

          </div>
        ))}
      </div>
    </div>
  )
})

export default PrintCoupons
