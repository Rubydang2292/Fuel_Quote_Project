import React, { useContext, useState, useCallback, useEffect } from "react";
import AppContext from "./AppContext";
import axios from "axios";
import { pricingCalculate } from "./PricingModule";
export default function FuelQuoteItem({ user }) {
  const { state, dispatch } = useContext(AppContext);
  const { quotes } = state;

  // function to request to get all Quotes
  const getAllQuotes = useCallback(async () => {
    try {
      const options = {
        method: "get", // must be method get
        url: "/api/v1/quotes/quoteHistory",
      };

      // after succesfully requested, data will be saved into response
      const response = await axios(options);

      const quotes = response.data.data.quotes;

      console.log(quotes);

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

  // Combine address, city, state, zipcode
  const deliveryAddress =
    user.address1 + ", " + user.city + ", " + user.state + " " + user.zipcode;

  const [quoteInput, setQuoteInput] = useState({
    gallons: "",
    delivery_address: deliveryAddress,
    delivery_date: "",
    suggested_price: "",
    total_amount: "",
  });

  const onChangeHandler = (e) => {
    setQuoteInput({ ...quoteInput, [e.target.name]: e.target.value });
  };

  const [submitButton, setSubmitButton] = useState(false);

  const priceCalulated = () => {
    const gallons = parseInt(quoteInput.gallons);
    let locationFactor = 0;
    let rateHistoryFactor = 0;
    let gallonRequestedFactor = 0;
    const state = user.state.toUpperCase();

    // get user quotes only
    const userQuotes = quotes.filter(
      (quote) => quote.author && quote.author.name && quote.author.name === user.name
    );

    const quotesLength = userQuotes.length;
    const companyProfitFactor = 0.1;
    const currentPrice = 1.5;

    if (state === "TX") {
      locationFactor = 0.02;
    } else {
      locationFactor = 0.04;
    }

    if (quotesLength === 0) {
      rateHistoryFactor = 0;
    } else {
      rateHistoryFactor = 0.01;
    }

    if (gallons >= 1000) {
      gallonRequestedFactor = 0.02;
    } else {
      gallonRequestedFactor = 0.03;
    }

    const [suggested_price, total_amount] = pricingCalculate(
      gallons,
      locationFactor,
      currentPrice,
      rateHistoryFactor,
      gallonRequestedFactor,
      companyProfitFactor
    );

    console.log(suggested_price, total_amount);

    setQuoteInput({
      gallons: gallons.toFixed(),
      delivery_address: quoteInput.delivery_address,
      delivery_date: quoteInput.delivery_date,
      suggested_price: suggested_price.toFixed(3),
      total_amount: total_amount.toFixed(3),
    });

    setSubmitButton(true);
  };

  const onSubmitHandler = async (e) => {
    try {
      e.preventDefault();
      const token = localStorage.getItem("token");
      const options = {
        method: "post",
        url: "/api/v1/quotes/fuelQuote",
        data: quoteInput,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await axios(options);

      const { quote } = response.data.data;
      console.log(quote);

      dispatch({
        type: "CREATE_ONE_QUOTE",
        payload: { ...quote },
      });

      setQuoteInput({
        gallons: "",
        delivery_address: deliveryAddress,
        delivery_date: "",
      });

      setSubmitButton(false);
      alert("succesfully quoted");
    } catch (error) {
      console.log(error);
    }
  };

  // buttonDisable = True if Gallons and Delivery_date have no data
  const buttonDisable =
    quoteInput.gallons.length === 0 || quoteInput.delivery_date.length === 0;

  const fuelQuoteError = [];
  if (quoteInput.gallons < 0) {
    fuelQuoteError.push("Gallons should be a positive number");
  }
  if (new Date(quoteInput.delivery_date) < new Date()) {
    fuelQuoteError.push("Deliver Date is not valid");
  }

  console.log(fuelQuoteError);

  return (
    <div id="fuel">
      <form id="fuel-form" onSubmit={onSubmitHandler}>
        <div id="form-name">
          <h2>Fuel Quote</h2>
        </div>

        <div id="information">
          {fuelQuoteError ? (
            fuelQuoteError.map((error) => (
              <div
                className="error-message"
                style={{ margin: "10px 0px 10px 0px" }}
              >
                Error: {error}
              </div>
            ))
          ) : (
            <div></div>
          )}
          <div id="gallons" style={{ marginTop: "10px" }}>
            <label>Gallons</label>

            <input
              type="number"
              id="gallons"
              name="gallons"
              placeholder="Enter Gallons"
              required
              value={quoteInput.gallons}
              onChange={onChangeHandler}
              min="0"
            />
          </div>

          <div id="delivery-address">
            <label>Delivery Address</label>
            <input
              type="text"
              id="delivery_address"
              name="delivery_address"
              required
              disabled
              value={quoteInput.delivery_address}
              onChange={onChangeHandler}
            />
          </div>

          <div id="delivery-date">
            <label>Delivery Date</label>
            <input
              type="date"
              id="date"
              name="delivery_date"
              placeholder="yyyy-mm-dd"
              value={quoteInput.delivery_date}
              onChange={onChangeHandler}
              // min={new Date().toISOString().split("T")[0]}
              required
            />
          </div>

          <div id="result">
            <div id="suggested-price">
              <label>Suggested Price</label>
              <input
                type="number"
                id="suggested-price"
                name="suggested_price"
                placeholder="Suggested Price"
                required
                readOnly
                className="result"
                value={quoteInput.suggested_price}
                onChange={onChangeHandler}
              />
            </div>

            <div id="amount">
              <label>Total Amount Due</label>
              <input
                type="number"
                id="amount"
                name="total_amount"
                placeholder="Total Amount Due"
                required
                readOnly
                className="result"
                value={quoteInput.total_amount}
                onChange={onChangeHandler}
              />
            </div>
          </div>

          <div id="fuel-submit">
            <button
              type="button"
              onClick={priceCalulated}
              className={
                buttonDisable || fuelQuoteError.length > 0
                  ? "button-disabled"
                  : "button"
              }
              disabled={buttonDisable || fuelQuoteError.length > 0}
            >
              Get Quote
            </button>

            <button
              type="submit"
              className={submitButton ? "button" : "button-disabled"}
              disabled={!submitButton}
            >
              Submit Quote
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
