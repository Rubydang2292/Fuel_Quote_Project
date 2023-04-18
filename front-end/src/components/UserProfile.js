import React, { useCallback, useEffect, useContext } from "react";
import "../css/UserProfile.css";
import AppContext from "./AppContext";
import axios from "axios";
import UserProfileItem from "./UserProfileItem";

export default function UserProfile() {
  const { state, dispatch } = useContext(AppContext);
  const { user } = state;

  const getCurrentUser = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      const options = {
        method: "get",
        url: "/api/v1/auth/userProfile",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios(options);
      const user = response.data.data.user;

      console.log(user);

      dispatch({
        type: "CURRENT_USER",
        payload: user,
      });
    } catch (error) {
      console.log(error);
    }
  }, [dispatch]);

  useEffect(() => {
    getCurrentUser();
  }, [getCurrentUser]);

  return (
    <div id="hero" className="container">
      {user ? (
        <>
          <div id="profile-wrap">
            <UserProfileItem user={user} key={user.userId} />
          </div>
        </>
      ) : (
        <></>
      )}
    </div>
  );
}
