import React, { useContext } from "react";
import AppContext from "./AppContext";
import "../css/Header.css";
import { Link } from "react-router-dom";
import imageToRender from "../../src/assets/images/logo_team_20.png";

export default function Header() {

  const { state, dispatch } = useContext(AppContext);

  const { user } = state;

  console.log(user);

  const signOut = () => {
    localStorage.removeItem("token");

    dispatch({
      type: "CURRENT_USER",
      payload: null,
    });
  };

  return (
    <header id="top-bar" className="container has-two-col">
      <h1>
        <Link to="/">
          <img src={imageToRender} alt="" />
        </Link>
      </h1>

      <div className="inline">
        <ul id="menu" className="inline-list">
          {/* if user is available */}
          {user ? (
            <>
              {/* If user is admin */}
              {user.isAdmin ? (
                <>
                  <li id="name">
                    <Link to="">Hello, {user.name}</Link>
                  </li>
                  <li>
                    <Link to="/allUsers">All Users</Link>
                  </li>
                  <li>
                    <Link to="/quoteHistory">Quote History</Link>
                  </li>
                  <li onClick={signOut}>
                    <Link to="/">Sign out</Link>
                  </li>
                </>
              ) : (
                // If user is not admin
                <>
                  {user.address1 === "" && (
                    <>
                      <li onClick={signOut}>
                        <Link to="/">Sign out</Link>
                      </li>
                      <li id="name">
                        <Link to="/userProfile">Hello, {user.name}</Link>
                      </li>
                    </>
                  )}

                  {(user.address1 ||
                    user.state ||
                    user.city ||
                    user.zipcode) && (
                    <>
                      <li id="name">
                        <Link to="/userProfile">Hello, {user.name}</Link>
                      </li>

                      <li>
                        <Link to="/quoteHistory">Quote History</Link>
                      </li>

                      <li onClick={signOut}>
                        <Link to="/">Sign out</Link>
                      </li>

                      <li className="fuel-quote">
                        <Link to="/fuelQuote">Fuel Quote</Link>
                      </li>
                    </>
                  )}
                </>
              )}
            </>
          ) : (
            // if user not available
            <>
              <li className="fuel-quote">
                <Link to="/login">Login</Link>
              </li>
            </>
          )}
        </ul>

        <ul id="social">
          <li>
            <img src="image/social/fb.png" alt="" />
          </li>
          <li>
            <img src="image/social/tw.png" alt="" />
          </li>
          <li>
            <img src="image/social/youtube.png" alt="" />
          </li>
          <li>
            <img src="image/social/instagram.png" alt="" />
          </li>
        </ul>
      </div>
    </header>
  );
}
