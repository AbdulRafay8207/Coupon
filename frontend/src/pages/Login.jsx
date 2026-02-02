const Login = () => {
  return (
    <div>
        <h1>Login Page</h1>
        <form>
            <label htmlFor="username">Username</label>
            <input type="text" name="username" id="username" />
            <br />
            <label htmlFor="password">Password</label>
            <input type="text" name="password" id="password" />
            <br />
            <button type="submit">Login</button>
        </form>
    </div>
  )
}

export default Login