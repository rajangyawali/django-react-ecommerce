import React, { useEffect } from "react";
import "./App.css";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { Provider, connect } from "react-redux";
import Home from "./components/Home";
import Contact from "./components/Contact";
import About from "./components/About";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Notfound from "./components/Notfound";
import store from "./store";
import ProductDetail from "./components/ProductDetail";
import Layout from "./hocs/Layout";
import Profile from "./components/Profile";
import Footer from "./components/Footer";
import WishList from "./components/WishList";
import Checkout from "./components/Checkout";
import CartList from "./components/CartList";

const App = () => {
  return (
    <Provider store={store}>
      <div className="app">
        <Router>
          <Layout>
            <Switch>
              <Route exact path="/" component={Home} />
              <Route exact path="/products/:id" component={ProductDetail} />
              <Route exact path="/contact" component={Contact} />
              <Route exact path="/order-summary" component={CartList} />
              <Route exact path="/wishlist-summary" component={WishList} />
              <Route exact path="/about" component={About} />
              <Route exact path="/login" component={Login} />
              <Route exact path="/signup" component={Signup} />
              <Route exact path="/profile" component={Profile} />
              <Route exact path="/checkout" component={Checkout} />
              <Route component={Notfound} />
            </Switch>
          </Layout>
          <Footer />
        </Router>
      </div>
    </Provider>
  );
};

export default App;
