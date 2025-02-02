import { useState } from "react";
import { verifyLogin } from "../../API/API";
import "./Login.css";
import RegisterForm from "../RegisterForm/RegisterForm";
import show from "../../images/show.png";
import hide from "../../images/hide.png";

const Login = (props) => {
  const [error, setError] = useState("");
  const [UserName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [isRegister, setIsRegister] = useState(false);
  const [isShow, setIsShow] = useState(false);

  const verifyUserLogin = () => {
    verifyLogin(UserName, password, props.setUserId, setError);
  };

  return (
    <>
      {!isRegister ? (
        <div className="loginContainer">
          <div className="loginCard">
            <div className="loginLabel">User Name</div>
            <div>
              <input
                className="loginInput"
                onChange={(e) => setUserName(e.target.value)}
              />
            </div>
            <div className="loginLabel">Password</div>
            <div>
              <input
                className="loginInput"
                type={isShow ? "text" : "password"}
                onChange={(e) => setPassword(e.target.value)}
              />
              <img
                className="showHide"
                src={isShow ? show : hide}
                alt="show/hide"
                onClick={() => setIsShow(!isShow)}
                height={"40px"}
              />
            </div>
            <div className="loginMessage">{error}</div>
            <div>
              <button className="loginButton" onClick={verifyUserLogin}>
                LOGIN
              </button>
            </div>
            <div
              onClick={() => {
                setIsRegister(true);
              }}
            >
              <a>New user? Register.</a>
            </div>
          </div>
        </div>
      ) : (
        <RegisterForm setIsRegister={setIsRegister} />
      )}
    </>
  );
};

export default Login;
