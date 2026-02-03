import { useEffect, useState } from "react"
import {QRCodeCanvas} from "qrcode.react";

const Dashboard = () => {
    const [cards, setCards] = useState([])
    const [cancelArea, setCancelArea] = useState("")
    
    
    async function fetchCards () {
        const response = await fetch("http://localhost:8000/cards",{
        })
        const data = await response.json()
        setCards(data.Cards)
    }

    function getStatus(c){
        if(c.isUsed) return "Used"
        if(c.isCancelled) return "Cancelled"
        
        const today = new Date()
        const validTo = new Date(c.validTo)
        if(today > validTo) return "Expired"
        
        return "Active"
    }

    async function cancelCard(token){
        const confirmCancel = window.confirm(`Are you sure you want to cancel ${token}`)

        if(!confirmCancel) return
        
        await fetch("http://localhost:8000/cards/cancel",{
            method: "POST",
            headers:{
                "Content-Type":"application/json",
            },
            body: JSON.stringify({token})
        })
        fetchCards()
    }

    async function cancelAreaCards() {
        if(!cancelArea) return alert("Enter area")
        const confirmCancelArea = window.confirm(`Are you sure you want to cancel all cards of area ${cancelArea}`)

        if(!confirmCancelArea) return

        const response = await fetch("http://localhost:8000/cards/cancel",{
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({area: cancelArea})
        })
        const data = await response.json()
        alert(data.message)
        setCancelArea("")
        fetchCards()
    }

    useEffect(()=>{
        fetchCards()
    },[])
  return (
    <div>
        <h1>Dashboard Page</h1>
        <div style={{margin: "5px 5px"}}>
            <input type="text" value={cancelArea} onChange={(e)=> setCancelArea(e.target.value)} placeholder="Enter area to cancel" />
            <button onClick={()=> cancelAreaCards()}>Cancel</button>      
        </div>
        <table border={1}>
            <thead>
                <tr>
                    <th>Token</th>
                    <th>Discount</th>
                    <th>Area</th>
                    <th>Status</th>
                    <th>Action</th>
                </tr>
            </thead>
            <tbody>
                {cards.map(card =>{
                    return(<tr key={card.token}>
                        <td>{card.token}</td>
                        <td>{card.discountValue}</td>
                        <td>{card.area}</td> 
                        <td>{getStatus(card)}</td>
                        <td><QRCodeCanvas
                        value={JSON.stringify({
                            qrid: card.qrid,
                            token: card.token,
                            secret: card.secret
                        })}
                        size={80}
                        />
                        </td>
                        <td>{getStatus(card) === "Active" && <button onClick={()=> cancelCard(card.token)}>Cancel</button>}</td>
                    </tr>
                    )
                })}
            </tbody>
        </table>
    </div>
  )
}

export default Dashboard