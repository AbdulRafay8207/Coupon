const getAuthHeader = (accessToken) => ({
    "Content-Type": "application/json",
    Authorization: `Bearer ${accessToken}`,
});

export default getAuthHeader