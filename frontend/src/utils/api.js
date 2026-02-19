export const fetchWithRefresh = async (url, options, setAuth, navigate) => {

    
    try {
        const response = await fetch(url, options)

        if(response.status === 401){
            const refreshResponse = await fetch(`${import.meta.env.VITE_API_URL}/refresh`,{
                method: "POST",
                credentials: "include"
            })

            if(!refreshResponse.ok) throw new Error("Session Expired")

            const data = await refreshResponse.json()

            if(data.accessToken){
                setAuth(prev => ({...prev, accessToken: data.accessToken}))
                options.headers["Authorization"] = `Bearer ${data.accessToken}`
                return await fetch(url, options)
            } else{
                throw new Error("Could not refresh token")
            }
        }
        return response
    } catch (error) {
        console.log("API request failed", error);
        setAuth({accessToken: null, username: null, role: null, message: "Session expired. Please login again."})
        navigate("/login")
    }
}