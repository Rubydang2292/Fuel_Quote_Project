import React, { useContext, useState } from "react";
import "../css/Login.css";
import { Link } from "react-router-dom";
import axios from "axios";
import AppContext from "./AppContext";
import { useNavigate } from "react-router";

export default function Login() {
  // useContext: to get the DISPATCH from AppContext
  const { dispatch } = useContext(AppContext);

  const [userInput, setUserInput] = useState({
    email: "",
    password: "",
  });

  const [passwordShown, setPasswordShown] = useState(false);

  const togglePassword = () => {
    setPasswordShown(!passwordShown);
  };

  const [errorMessage, setErrorMessage] = useState(null);

  const navigate = useNavigate();

  const onChangeHandler = (e) => {
    //when user type Email, password
    // setUserInput will update value into userInput
    setUserInput({
      ...userInput,
      [e.target.name]: e.target.value,
    });
  };

  const onSubmitHandler = async (e) => {
    try {
      e.preventDefault(); // current Page will not reload when submit

      const options = {
        method: "post",
        url: "/api/v1/auth/login",
        data: userInput, // data is email, password from the form
      };

      // send request to server
      const response = await axios(options);

      const {
        token,
        userId,
        name,
        address1,
        address2,
        city,
        state,
        zipcode,
        isAdmin,
      } = response.data.data;

      // save TOKEN into Local Storage
      localStorage.setItem("token", token);

      // use DISPATCH to update the initital State with userName from the server
      dispatch({
        type: "CURRENT_USER",
        payload: {
          userId,
          name,
          address1,
          address2,
          city,
          state,
          zipcode,
          isAdmin,
        },
      });

      navigate("/");
    } catch (error) {
      setErrorMessage(error.response.data.message);
    }
  };
  console.log(errorMessage);
  return (
    <div id="hero" className="container has-two-col">
      <div id="login">
        <form id="login-form" onSubmit={onSubmitHandler}>
          <div id="form-name">
            <h2>Login Form</h2>
          </div>

          <div id="id-password-submit">
            {errorMessage && (
              <div id="error-massage">Error: {errorMessage}</div>
            )}

            <div id="email">
              <input
                type="email"
                name="email"
                placeholder="Email"
                required
                value={userInput.email}
                onChange={onChangeHandler}
              />
            </div>

            <div id="password">
              <input
                type={passwordShown ? "text" : "password"}
                name="password"
                placeholder="Password"
                required
                value={userInput.password}
                onChange={onChangeHandler}
              />
              <span id="show-password" onClick={togglePassword}>
                Show
              </span>
            </div>

            <div id="signin">
              <button type="submit"> Sign In</button>
            </div>

            <div id="signup">
              <p>New to ROU?</p>
              <Link to="/Register">Create an account</Link>
            </div>
          </div>
        </form>
      </div>

      <div id="hero-right">
        <img src="image/background1/people.png" alt="" />
      </div>
    </div>
  );
}
