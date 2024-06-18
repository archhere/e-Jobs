import React, { useState } from "react"
import "./Login.scss"
import newRequest from "../../utils/newRequest";
import { useNavigate } from "react-router-dom";
import { ERROR_GENERIC } from "../../utils/constants";
import { toast } from 'react-custom-alert';

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const resp = await newRequest.post("auth/login", { username, password });
      localStorage.setItem("currentUser", JSON.stringify(resp.data));
      navigate("/");
    } catch(err) {
      handleError(err?.response?.data || ERROR_GENERIC)
    }
  }

  const handleError = (err) => {
    return toast.error(err, {toastId: err});
  }

  return (
    <div className="login">
      <form onSubmit={handleSubmit}>
        <h1>Sign in</h1>
        <label htmlFor="">Username</label>
        <input name="username" type="text" placeholder="username" onChange={e=>setUsername(e.target.value)}/>

        <label htmlFor="">Password</label>
        <input
          name="password"
          type="password"
          onChange={e=>{setPassword(e.target.value)}}
        />
        <button disabled = {!username.length || !password.length} type="submit">Login</button>
      </form>
    </div>
  )
}

export default Login