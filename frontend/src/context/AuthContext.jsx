import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState({
        accessToken: null,
        username: null,
        role: null
    })
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const restoreSession = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/refresh`, {
                    method: "POST",
                    credentials: "include"
                })
                if (!response.ok) return

                const data = await response.json()

                if (data.accessToken) {
                    setAuth({
                        accessToken: data.accessToken,
                        username: data.username, 
                        role: data.role          
                    });
                }
            } catch {

            } finally {
                setLoading(false)
            }
        }
        restoreSession()
    }, [])

    if (loading) return <div className="spinner">Loading...</div>

    return (
        <AuthContext.Provider value={{ auth, setAuth }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext)