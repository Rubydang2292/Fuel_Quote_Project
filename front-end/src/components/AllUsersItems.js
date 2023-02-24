import React from 'react'

export default function AllUsersItems({ user }) {
    const deliveryAddress = user.address1 + ", " + user.city + ", " + user.state + " " + user.zipcode
    return (

        <tr className="users-items">
            <td>{user.name}</td>
            <td>{user.email}</td>
            <td>{deliveryAddress}</td>
        </tr>
    )
}
