import React, { useContext } from 'react'
import '../css/FuelQuote.css'
import AppContext from './AppContext';
import FuelQuoteItem from './FuelQuoteItem';

export default function FuelQuote() {
    const { state} = useContext(AppContext);
    const { user } = state

    console.log(user)

    return (
        <div id="hero" className="container">

            {user ? (
                <>
                    <div id="fuel" >
                        <FuelQuoteItem user={user} key={user.userId} />
                    </div>
                </>
            ) : (
                <></>
            )}
        </div>
    )
}