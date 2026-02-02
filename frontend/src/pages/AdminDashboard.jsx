import { useEffect, useState } from "react"
import { QRCodeCanvas } from "qrcode.react"

const Dashboard = () => {
  const [cards, setCards] = useState([])
  const [status, setStatus] = useState("active")
  const [loading, setLoading] = useState(false)
  const [cancelArea, setCancelArea] = useState("")

  useEffect(() => {
    fetchCards(status)
  }, [status])

  async function fetchCards(type) {
    setLoading(true)
    try {
      const res = await fetch(
        `http://localhost:5000/cards/status?type=${type}`
      )
      const data = await res.json()
      setCards(data.cards)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  async function cancelCard(token) {
    if (!window.confirm(`Cancel card ${token}?`)) return

    await fetch("http://localhost:5000/cards/cancel", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token })
    })

    fetchCards(status)
  }

  async function cancelAreaCards() {
    if (!cancelArea) return alert("Enter area")

    if (!window.confirm(`Cancel all cards in ${cancelArea}?`)) return

    const res = await fetch("http://localhost:5000/cards/cancel", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ area: cancelArea })
    })

    const data = await res.json()
    alert(data.message)
    setCancelArea("")
    fetchCards(status)
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
      {["active", "expired"].map((s) => (
        <button
          key={s}
          onClick={() => setStatus(s)}
          style={{
            marginRight: 5,
            fontWeight: status === s ? "bold" : "normal"
          }}
        >
          {s.toUpperCase()}
        </button>
      ))}

      <h3>
        Showing {status.toUpperCase()} cards: {cards.length}
      </h3>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <table border={1} cellPadding={5}>
          <thead>
            <tr>
              <th>QRID</th>
              <th>Token</th>
              <th>Secret</th>
              <th>Discount</th>
              <th>Area</th>
              <th>Valid From</th>
              <th>Valid To</th>
              <th>Status</th>
              <th>QR</th>
              {status === "expired"? "": <th>Action</th>}
            </tr>
          </thead>
          <tbody>
            {cards.map((card) => (
              <tr key={card.qrid}>
                <td>{card.qrid}</td>
                <td>{card.token}</td>
                <td>{card.secret}</td>
                <td>{card.discountValue}</td>
                <td>{card.area}</td>
                <td>{card.validFrom}</td>
                <td>{card.validTo}</td>
                <td>{status.toUpperCase()}</td>
                <td>
                  <QRCodeCanvas
                    size={80}
                    value={JSON.stringify({
                      qrid: card.qrid,
                      token: card.token,
                      secret: card.secret
                    })}
                  />
                </td>
                <td>
                  {status === "active" && (
                    <button onClick={() => cancelCard(card.token)}>
                      Cancel
                    </button>
                  )}
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