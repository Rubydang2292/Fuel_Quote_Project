import React, { useContext, useState } from "react";
import axios from "axios";
import AppContext from "./AppContext";

export default function UserProfileItem({ user }) {
  const { dispatch } = useContext(AppContext);

  const [openEditForm, setOpenEditForm] = useState(false);

  const [userToEdit, setUserToEdit] = useState(user);

  const [errorMessage, setErrorMessage] = useState(null);

  const updateCurrentUser = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");

      const options = {
        method: "put",
        url: `/api/v1/auth/userProfile/${user.userId}`,
        data: userToEdit,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      await axios(options);
      dispatch({
        type: "UPDATE_CURRENT_USER",
        payload: { ...userToEdit },
      });

      setOpenEditForm(false);
      window.location.reload();
    } catch (error) {
      setErrorMessage(error.response.data.message);
    }
  };
  console.log(errorMessage);
  return (
    <div id="profile-wrap">
      {openEditForm === false && (
        <>
          <div id="user-profile">
            <form className="profile-form">
              <div id="form-name">
                <h2>User Profile</h2>
              </div>

              <div id="information">
                <div id="profile-wrap">
                  <div id="name">
                    <label>Full Name</label>
                    <p>{user.name}</p>
                  </div>

                  <div id="address1">
                    <label>Address 1</label>
                    <p>{user.address1}</p>
                  </div>

                  <div id="address2">
                    <label>Address 2</label>
                    <p>{user.address2}</p>
                  </div>

                  <div id="city-state-zip">
                    <div id="city">
                      <label>City</label>
                      <p>{user.city}</p>
                    </div>

                    <div id="state">
                      <label>State</label>
                      <p>{user.state}</p>
                    </div>

                    <div id="zipcode">
                      <label>Zip code</label>
                      <p>{user.zipcode}</p>
                    </div>
                  </div>
                </div>

                <div id="profile-edit">
                  <span onClick={() => setOpenEditForm(true)}>Edit</span>
                </div>
              </div>
            </form>
          </div>
        </>
      )}

      {openEditForm && (
        <>
          <div id="profile-edit " className="fade-in">
            <form className="profile-form" onSubmit={updateCurrentUser}>
              <div id="form-name">
                <h2>Update Information</h2>
              </div>

              <div id="information">
                {errorMessage &&
                  (Array.isArray(errorMessage) ? ( 
                    errorMessage.map((err) => (
                      <div className="error-message">Error: {err}</div>
                    ))
                  ) : (
                    <div className="error-message">Error: {errorMessage}</div>
                  ))}
                <div id="edit-wrap">
                  <div id="name">
                    <label>Full Name</label>

                    <input
                      type="text"
                      id="name"
                      name="name"
                      placeholder="Enter Name"
                      value={userToEdit.name}
                      onChange={(e) =>
                        setUserToEdit({ ...userToEdit, name: e.target.value })
                      }
                      required
                    />
                  </div>

                  <div id="address1">
                    <label>Address 1</label>
                    <input
                      type="text"
                      id="address1"
                      name="address1"
                      placeholder="Enter Address 1"
                      value={userToEdit.address1}
                      onChange={(e) =>
                        setUserToEdit({
                          ...userToEdit,
                          address1: e.target.value,
                        })
                      }
                      required
                    />
                  </div>

                  <div id="address2">
                    <label>Address 2</label>
                    <input
                      type="text"
                      id="address2"
                      name="address2"
                      placeholder="Enter Address 2"
                      value={userToEdit.address2}
                      onChange={(e) =>
                        setUserToEdit({
                          ...userToEdit,
                          address2: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div id="city-state-zip">
                    <div id="city">
                      <label>City</label>
                      <input
                        type="text"
                        id="city"
                        name="city"
                        placeholder="Enter City"
                        required
                        value={userToEdit.city}
                        onChange={(e) =>
                          setUserToEdit({ ...userToEdit, city: e.target.value })
                        }
                      />
                    </div>

                    <div id="state">
                      <label>State</label>
                      <select
                        id="state"
                        name="state"
                        value={userToEdit.state}
                        onChange={(e) =>
                          setUserToEdit({
                            ...userToEdit,
                            state: e.target.value,
                          })
                        }
                        required
                      >
                        <option selected hidden>
                          Choose...
                        </option>
                        <option>AA</option>
                        <option>AE</option>
                        <option>AK</option>
                        <option>AL</option>
                        <option>AP</option>
                        <option>AR</option>
                        <option>AZ</option>
                        <option>CA</option>
                        <option>CO</option>
                        <option>CT</option>
                        <option>DC</option>
                        <option>DE</option>
                        <option>FL</option>
                        <option>HI</option>
                        <option>ID</option>
                        <option>IL</option>
                        <option>IN</option>
                        <option>IA</option>
                        <option>KS</option>
                        <option>KY</option>
                        <option>LA</option>
                        <option>ME</option>
                        <option>MD</option>
                        <option>MA</option>
                        <option>MI</option>
                        <option>MN</option>
                        <option>MS</option>
                        <option>MO</option>
                        <option>MT</option>
                        <option>NE</option>
                        <option>NV</option>
                        <option>NH</option>
                        <option>NJ</option>
                        <option>NM</option>
                        <option>NY</option>
                        <option>NC</option>
                        <option>ND</option>
                        <option>OH</option>
                        <option>OK</option>
                        <option>OR</option>
                        <option>PA</option>
                        <option>RI</option>
                        <option>SC</option>
                        <option>SD</option>
                        <option>TN</option>
                        <option>TX</option>
                        <option>UT</option>
                        <option>VT</option>
                        <option>VA</option>
                        <option>WA</option>
                        <option>WV</option>
                        <option>WI</option>
                        <option>WY</option>
                      </select>
                    </div>

                    <div id="zipcode">
                      <label>Zip code</label>
                      <input
                        type="text"
                        id="zipcode"
                        name="zipcode"
                        placeholder="Enter Zip code"
                        minLength="5"
                        maxLength="9"
                        required
                        value={userToEdit.zipcode}
                        onChange={(e) =>
                          setUserToEdit({
                            ...userToEdit,
                            zipcode: e.target.value,
                          })
                        }
                        onWheel={(e) => e.target.blur()}
                      />
                    </div>
                  </div>
                </div>

                <div id="profile-submit">
                  <button type="submit">Update</button>
                  <button onClick={() => setOpenEditForm(false)} type="button">
                    Cancel
                  </button>
                </div>
              </div>
            </form>
          </div>
        </>
      )}
    </div>
  );
}
