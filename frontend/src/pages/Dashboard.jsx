  import { useEffect, useState } from "react"
  import { useNavigate } from "react-router"
  import getAuthHeader from "../components/GetAuthHeader"
  import { API_BASE_URL } from "../config"
  import "../style/Dashboard.css"

  const TestDashboard = () => {
    const navigate = useNavigate()

    const [loading, setLoading] = useState(false)
    const [sponsoredSummary, setSponsoredSummary] = useState([])

    useEffect(() => {
      fetchCoupons()
    }, [])


    async function fetchCoupons() {
      setLoading(true)
      try {
        const res = await fetch(
          `${API_BASE_URL}/coupons/testStatus`,
          {
            headers: getAuthHeader()
          },
        )
        const data = await res.json()
        setSponsoredSummary(data.summary)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }


    async function navigateToDetail(sponsoredName){
      navigate(`/sponsored-details/${encodeURIComponent(sponsoredName)}`)
    }

    async function cancelSponsored(sponsoredName) {
      if (!window.confirm(`Cancel all coupons of ${sponsoredName}?`)) return

      const res = await fetch(`${API_BASE_URL}/coupons/cancel`, {
        method: "POST",
        headers: getAuthHeader(),
        body: JSON.stringify({ sponsoredName })
      })
      const data = await res.json()
      // setMessage(data.message)
      // if (res.status == 401) {
      //   navigate("/login")
      //   return
      // }
      alert(data.message)
      setCancelArea("")
      fetchCoupons()
    }


    return (
      <>
      <div className="container">
          <h1>Dashboard</h1>
          <p>Manage coupons and their status</p>
      </div>

      <div className="filters">
          <p className="total">Total Partners: {sponsoredSummary.length}</p>    
      </div>

        <div className="table-container">
          <div className="table-wrapper">
            {loading ? (
              <p>Loading...</p>
            ) : (
              <table className="dashboard-table">
                <thead>
                  <tr>
                    <th>Sponsored</th>
                    <th>Discount Type</th>
                    <th>Services</th>
                    <th>Discount Value</th>
                    <th>Valid From</th>
                    <th>Valid To</th>
                    <th>Total Coupons</th>
                    <th>Used Coupons</th>
                    <th>Cancelled Coupons</th>
                    <th>Expired Coupons</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {sponsoredSummary.map((shop,index) => (
                    <tr key={index}>
                      <td>{shop._id}</td>
                      <td>{shop.discountType}</td>
                      <td>{shop.services.length > 0? shop.services.join(", ") : "-"}</td>
                      <td>{shop.discountValue}</td>
                      <td>{new Date(shop.validFrom).toLocaleDateString()}</td>
                      <td>{new Date(shop.validTo).toLocaleDateString()}</td>
                      <td>{shop.totalCoupons}</td>
                      <td>{shop.usedCoupons}</td>
                      <td>{shop.cancelledCoupons}</td>
                      <td>{shop.expiredCoupons}</td>
                      <td><button className="detail-btn" onClick={() => navigateToDetail(shop._id)}>Detail</button> <button onClick={() => cancelSponsored(shop._id)}>Cancel</button></td>
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

  export default TestDashboard