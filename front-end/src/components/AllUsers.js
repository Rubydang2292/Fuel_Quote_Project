import React, { useEffect, useCallback, useContext } from 'react'
import '../css/AllUsers.css'
import AllUsersItems from './AllUsersItems'
import axios from 'axios';

import AppContext from './AppContext';

export default function AllUsers() {
    const { state, dispatch } = useContext(AppContext);

    // get quotes and user in state
    const { users } = state

    console.log(users)
    // function to request to get all Quotes


    // function to request to get the user information
    const getAllUsers = useCallback(async () => {
        try {
            const options = {
                method: "get",
                url: "/api/v1/auth/allUsers",
            };
            const response = await axios(options);

            console.log(response)
            const users = response.data.data.users;

            console.log(users)

            dispatch({
                type: "GET_ALL_USERS",
                payload: users
            })
        } catch (error) {
            console.log(error)
        }
    }, [dispatch])

    useEffect(() => {
        getAllUsers()
    }, [getAllUsers])


    return (
        <div id="hero" className="container">

            <div id="users-info">

                <div id="form-name">
                    <h2>Users Infomation</h2>
                </div>

                <div id="information">
                    <table>
                        <thead className='users-labels'>
                            <tr>
                                <th scope="col" className="customer-name">Customer Name </th>
                                <th scope="col" className="customer-email">Customer Email </th>
                                <th scope="col" className="customer-address">Customer Address</th>
                            </tr>
                        </thead>

                        <tbody>
                            {users.map((user) => (
                                // if isAdmin is available, dont print it
                                !user.isAdmin && (
                                    <AllUsersItems user={user} key={user._id} />
                                )
                            ))}
                        </tbody>


                    </table>
                </div>



            </div>


        </div>
    )
}
