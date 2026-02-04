function getAuthHeader(){
    const JWTtoken = localStorage.getItem("token")
    return {
      "Content-Type" : "application/json",
      Authorization: `Bearer ${JWTtoken}`
    }
  }
  export default getAuthHeader