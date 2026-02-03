import { useState } from "react"

const Test = ()=>{
    const [message, setMessage] = useState(null)
    async function fetch(){
        try{
            await fetch("")   
    }catch(err){
        console.log("err",err);
        
    }
    }
    return(
        <div>
            <h1>Test Page</h1>

        </div>
    )
}
export default Test