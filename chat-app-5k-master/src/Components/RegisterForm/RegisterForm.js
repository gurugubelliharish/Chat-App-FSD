import React, { useState } from "react";
import "./RegisterForm.css";
import {registerUser} from "../../API/API"

const RegisterForm = (props) => {
  const [userName, setUserName] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [number, setNumber] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    if (
      userName &&
      name &&
      password &&
      number &&
      password === confirmPassword
    ) {
        props.setIsRegister(false)
        registerUser(userName,name,password,number)
    } else {
        props.setIsRegister(true)
      password === confirmPassword
        ? setError("All Fields are mandatory !")
        : setError("passwords doesn't match !");
    }
  };

  return (
    <div className="registerContainer" >
      <div className="registerCard">
        <div>
          <label className="registerLabel">Username:</label>
        </div>
        <div>
          <input
            className="registerInput"
            type="text"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
          />
        </div>
        <div>
          <label className="registerLabel">Name:</label>
        </div>
        <div>
          <input
            className="registerInput"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div>
          <label className="registerLabel">Password:</label>
        </div>
        <div>
          <input
            className="registerInput"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div>
          <label className="registerLabel">Confirm Password:</label>
        </div>
        <div>
          <input
            className="registerInput"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>
        <div>
          <label className="registerLabel">Number:</label>
        </div>
        <div>
          <input
            className="registerInput"
            type="tel"
            value={number}
            onChange={(e) => setNumber(e.target.value)}
          />
        </div>
        <div>
          <label className="registerMessage">{error}</label>
        </div>
        <div>
          <button className="registerButton" onClick={handleSubmit}>
            Register
          </button>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;
