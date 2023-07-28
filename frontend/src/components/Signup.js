import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "./css/RegisterPage.css";
import AuthContext from "../context/AuthProvider";

const Signup = () => {
  const navigate = useNavigate();
  const { setAuth, settoken } = useContext(AuthContext);
  const [inputValue, setInputValue] = useState({
    email: "",
    password: "",
    username: "",
  });
  const { email, password, name } = inputValue;
  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setInputValue({
      ...inputValue,
      [name]: value,
    });
  };

  const handleError = (err) =>
    toast.error(err, {
      position: "bottom-left",
    });
  const handleSuccess = (msg) =>
    toast.success(msg, {
      position: "bottom-right",
    });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        "http://localhost:5000/signup",
        {
          ...inputValue,
        },
        { withCredentials: true }
      );
      const { success, message, userName, userEmail, isAdmin  } = data;
      if (success) {
        handleSuccess(message);
        setAuth({ success, message, userName, userEmail, isAdmin });
        settoken(data.token);
        navigate("/");
        setTimeout(() => {}, 1000);
      } else {
        handleError(message);
      }
    } catch (error) {
      console.log(error);
    }
    // window.location.reload();
    setInputValue({
      ...inputValue,
      email: "",
      password: "",
      name: "",
    });
  };

  return (
    <div className="register-container">
      <h2>Signup Account</h2>
      <form onSubmit={handleSubmit}>
        <div className="input-container">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            name="email"
            value={email}
            placeholder="Enter your email"
            onChange={handleOnChange}
          />
        </div>
        <div className="input-container">
          <label htmlFor="email">Name</label>
          <input
            type="text"
            name="name"
            value={name}
            placeholder="Enter your Name"
            onChange={handleOnChange}
          />
        </div>
        <div className="input-container">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            name="password"
            value={password}
            placeholder="Enter your password"
            onChange={handleOnChange}
          />
        </div>
        <button className="register-button" type="submit">
          Submit
        </button>
        <span>
          Already have an account? <Link to={"/login"}>Login</Link>
        </span>
      </form>
      <ToastContainer />
    </div>
  );
};

export default Signup;
