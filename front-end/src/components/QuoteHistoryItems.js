import React from 'react'

export default function QuoteHistoryItems({quote}) {

    let date = new Date(quote.delivery_date);

    return (
        <tbody>
            <tr className="quote-items">
                <th scope="row" className="name">{quote.author.name} </th>
                <td>{quote.gallons}</td>
                <td>{quote.delivery_address}</td>
                <td>{`${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()+1}`}</td>
                <td className="dollar">{quote.suggested_price}</td>
                <td>{quote.total_amount}</td>
            </tr>

        </tbody>
    )
}
