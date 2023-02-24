import React, { useEffect, useCallback, useContext } from "react";
import "../css/QuoteHistory.css";

import axios from "axios";

import AppContext from "./AppContext";
import QuoteHistoryItems from "./QuoteHistoryItems";

export default function QuoteHistory() {
  const { state, dispatch } = useContext(AppContext);

  // get quotes and user in state
  const { quotes, user } = state;

  // function to request to get all Quotes
  const getAllQuotes = useCallback(async () => {
    try {
      const options = {
        method: "get", // must be method get
        url: "/api/v1/quotes/quoteHistory",
      };

      // after succesfully requested, data will be saved into response
      const response = await axios(options);

      console.log(response);

      const quotes = response.data.data.quotes;

      dispatch({
        type: "GET_ALL_QUOTES",
        payload: quotes,
      });
    } catch (error) {
      console.log(error);
    }
  }, [dispatch]);

  useEffect(() => {
    getAllQuotes();
  }, [getAllQuotes]);

  const userQuotes = quotes.map((quote) => {
    // check if user is present
    if (user) {
      if (quote.author.name === user.name) {
        return { ...quote, isCurrentUser: true };
      } else {
        return quote;
      }
    } else {
      return { ...quote, isCurrentUser: false };
    }
  });
  console.log(user);

  // function to request to get the user information
  const getCurrentUser = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      const options = {
        method: "get",
        url: "/api/v1/auth/quoteHistory",
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
      <div id="fuel-history">
        <div id="form-name">
          <h2>Fuel Quote History</h2>
        </div>

        <div id="information">
          <table>
            <thead className="quote-history-labels">
              <tr>
                <th scope="col" className="customer">
                  Customer Name{" "}
                </th>
                <th scope="col" className="gallon">
                  Gallons{" "}
                </th>
                <th scope="col" className="Delivery">
                  Delivery Address
                </th>
                <th scope="col" className="date">
                  Delivery Date{" "}
                </th>
                <th scope="col" className="price">
                  Suggested Price
                </th>
                <th scope="col" className="amount">
                  Total Amount Due{" "}
                </th>
              </tr>
            </thead>

            {/* If user is admin, print all quotes history */}
            {user ? (
              <>
                {user.isAdmin ? (
                  <>
                    {userQuotes.map((quote) => (
                      <QuoteHistoryItems quote={quote} key={quote._id} />
                    ))}
                  </>
                ) : (
                  // If user is not admin, print quotes history according to user name
                  <>
                    {userQuotes.map(
                      (quote) =>
                        quote.isCurrentUser && (
                          <QuoteHistoryItems quote={quote} key={quote._id} />
                        )
                    )}
                  </>
                )}
              </>
            ) : (
              <></>
            )}
          </table>
        </div>
      </div>
    </div>
  );
}
