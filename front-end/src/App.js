import Footer from "./components/Footer";
import FuelQuote from "./components/FuelQuote";
import Header from "./components/Header";
import Hero from "./components/Hero";
import Login from "./components/Login";
import QuoteHistory from "./components/QuoteHistory";
import Register from "./components/Register";
import UserProfile from "./components/UserProfile";
import AllUsers from "./components/AllUsers";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AppReducer from "./reducers/AppReducer";
import { useCallback, useEffect, useReducer } from "react";
import AppContext from "./components/AppContext";
import axios from "axios";

function App() {
  const initialState = { user: null, quotes: [], users: [] };

  const [state, dispatch] = useReducer(AppReducer, initialState);

  // Check current user everytime user reload the page
  const checkCurrentUser = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      const options = {
        method: "get",
        url: "api/v1/auth/",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await axios(options);

      if (response.data.data.user) {
        const user = response.data.data.user;
        dispatch({
          type: "CURRENT_USER",
          payload: user,
        });
      }
      const user = response.data.data.user;
      return user.name;
    } catch (error) {
      console.log(error);
    }
  }, [dispatch]);

  useEffect(() => {
    checkCurrentUser();
  }, [checkCurrentUser]);

  return (
    <BrowserRouter>
      <AppContext.Provider value={{ state, dispatch }}>
        <div>
          <div id="top">
            <Header />

            <Routes>
              {/* Route Landing Page */}
              <Route path="/" element={<Hero />} />

              <Route path="/allUsers" element={<AllUsers />} />

              {/* Route Login */}
              <Route path="/login" element={<Login />} />

              {/* Route FuelQuote */}
              <Route path="/register" element={<Register />} />

              {/* Route FuelQuote */}
              <Route path="/fuelQuote" element={<FuelQuote />} />

              {/* Route QuoteHistory */}
              <Route path="/quoteHistory" element={<QuoteHistory />} />

              {/* Route UserProfile */}
              <Route path="/userProfile" element={<UserProfile />} />

              {/* Route others */}
              <Route
                path="*"
                element={
                  <div className="error-route container">Page Not Found</div>
                }
              />
            </Routes>
          </div>

          <Footer />
        </div>
      </AppContext.Provider>
    </BrowserRouter>
  );
}

export default App;
