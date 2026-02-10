import { useRef } from "react"
import { useLocation } from "react-router"
import { useReactToPrint } from "react-to-print"
import PrintCoupons from "../components/PrintCoupons"
import "../style/PrintLayout.css"

const PrintLayout = () => {
  const printRef = useRef()
  const location = useLocation()

  const { coupons, sponsoredName } = location.state || {}

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: `${sponsoredName}-coupons`
  })


  if (!coupons) return <p>No data to print</p>

  return (
    <>
    <div className="btn-container">
        <button className="print-btn" style={{}} onClick={() => handlePrint()}>Print</button>
    </div>
    <PrintCoupons
      ref={printRef}
      coupons={coupons}
      sponsoredName={sponsoredName}
    />
    </>
  )
}

export default PrintLayout
