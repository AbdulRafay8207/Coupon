import { useEffect, useState } from "react"
import * as XLSX from "xlsx"
import { saveAs } from "file-saver"
import getAuthHeader from "../utils/getAuthHeader.js"
import "../style/LabDashboard.css"
import { useNavigate } from "react-router"
import { useAuth } from "../context/AuthContext"
import { fetchWithRefresh } from "../utils/api.js"

const LabDashboard = () => {
  const [data, setData] = useState([])
  const [todayScans, setTodayScans] = useState(0)
  const [totalScans, setTotalScans] = useState(0)

  const [fromDate, setFromDate] = useState("")
  const [toDate, setToDate] = useState("")
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()
  const {auth, setAuth} = useAuth()

  const fetchDashboard = async (from = "", to = "") => {
    try {
      setLoading(true)
      let url = `${import.meta.env.VITE_API_URL}/coupons/lab-dashboard`
      if (from && to) {
        url += `?from=${from}&to=${to}`
      }

      const res = await fetchWithRefresh(url, {
        headers: getAuthHeader(auth.accessToken)
      },setAuth, navigate)

      const data = await res.json()

      setData(data.scans || [])
      setTodayScans(data.todayScans || 0)
      setTotalScans(data.totalScans || 0)
    } catch (error) {
      console.log("Error in fetchDashboard", error);
    } finally {
      setLoading(false)
    }

  }


  useEffect(() => {
    const today = new Date().toISOString().split("T")[0]
    fetchDashboard(today, today)
  }, [])

  const handleFilter = () => {
    if (!fromDate || !toDate) return alert("Select both dates")
    fetchDashboard(fromDate, toDate)
  }

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(data)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, "Scans")

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array"
    })

    const fileData = new Blob([excelBuffer], {
      type: "application/octet-stream"
    })

    saveAs(fileData, "lab-scan-report.xlsx")
  }

  return (
    <>
      <div className="lab-dashboard-container">
        <h2>Lab Dashboard</h2>
      </div>


      {/* Summary */}
      <div className="lab-staff-filter">
        <div className="lab-card-container">

          <div className="summary-card">
            <h3>Today's Scans</h3>
            <p>{todayScans}</p>
          </div>

          <div className="summary-card">
            <h3>Total Scans</h3>
            <p>{totalScans}</p>
          </div>
        </div>

        {/* Filter */}
        <div className="input-btn-container">
          <div className="filter-group">
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
            />
          </div>

          <div className="filter-group">
            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              style={{ marginLeft: "10px" }}
            />
          </div>

          <div className="filter-group">
            <button className="lab-btn" onClick={handleFilter} style={{ marginLeft: "10px" }}>
              Filter
            </button>
          </div>

          <div className="filter-group">
            <button className="lab-btn" onClick={() => {
              setFromDate("")
              setToDate("")
              const today = new Date().toISOString().split("T")[0]
              fetchDashboard(today, today)
            }}>Clearl Filter</button>
          </div>

          <div className="filter-group">
            <button className="excel lab-btn" onClick={exportToExcel} style={{ marginLeft: "10px" }}>
              Download Excel
            </button>
          </div>
        </div>
      </div>

      {/* Table */}

      <div className="lab-table-container">
        <div className="lab-table-wrapper">
          {loading ? <div className="lab-loading">
            <span className="loader"></span>
            <p>Loading data...</p>
          </div> : (
            <table className="lab-dashboard-table">
              <thead>
                <tr>
                  <th>Token</th>
                  <th>Sponsored Name</th>
                  <th>Discount</th>
                  <th>Used At</th>
                  <th>Valid From</th>
                  <th>Valid To</th>
                </tr>
              </thead>
              <tbody>

                {data.map((item) => (
                  <tr key={item._id}>
                    <td>{item.token}</td>
                    <td>{item.sponsoredName}</td>
                    <td>{item.discountValue}</td>
                    <td>{new Date(item.usedAt).toLocaleString()}</td>
                    <td>{new Date(item.validFrom).toLocaleDateString()}</td>
                    <td>{new Date(item.validTo).toLocaleDateString()}</td>
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


export default LabDashboard
