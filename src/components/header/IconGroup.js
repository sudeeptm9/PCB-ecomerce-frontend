import PropTypes from "prop-types";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import MenuCart from "./sub-components/MenuCart";
import { deleteFromCart } from "../../redux/actions/cartActions";
import axios from "axios";
import { useToasts } from "react-toast-notifications";
import Cookies from "universal-cookie";
import { useEffect } from "react";

const IconGroup = ({
  currency,
  cd,
  wishlistData,
  compareData,
  deleteFromCart,
  iconWhiteClass,
}) => {
  let { addToast } = useToasts();
  let [cartData, setCartData] = useState([]);
  const cookies = new Cookies();
  const email = cookies.get("Email") || null;
  const handleClick = (e) => {
    e.currentTarget.nextSibling.classList.toggle("active");
  };

  const triggerMobileMenu = () => {
    const offcanvasMobileMenu = document.querySelector(
      "#offcanvas-mobile-menu"
    );
    offcanvasMobileMenu.classList.add("active");
  };
  const Logout = () => {
    cookies.remove("Authorization");
    cookies.remove("Email");
    addToast("Logout Successfully", { appearance: "success" });
    window.location.reload();
  };
  const data = async () => {
    if (email != null) {
      axios
        .get(`http://localhost:8080/cart/${email}`)
        .then((response) => {
          cartData = response.data.arr;
          setCartData(cartData);
        })
        .catch((err) => {
          console.log(err);
          console.log("Handle error");
        });
    } else {
      cartData = [];
      return cartData;
    }
  };
  useEffect(() => {
    data();
  }, []);
  return (
    <div
      className={`header-right-wrap ${iconWhiteClass ? iconWhiteClass : ""}`}
    >
      {/* <div className="same-style header-search d-none d-lg-block">
        <button className="search-active" onClick={e => handleClick(e)}>
          <i className="pe-7s-search" />
        </button>
        <div className="search-content">
          <form action="#">
            <input type="text" placeholder="Search" />
            <button className="button-search">
              <i className="pe-7s-search" />
            </button>
          </form>
        </div>
      </div> */}
      <div className="same-style account-setting d-none d-lg-block">
        <button
          className="account-setting-active"
          onClick={(e) => handleClick(e)}
        >
          <i className="pe-7s-user-female" />
        </button>
        <div className="account-dropdown">
          <ul>
            {email != null ? (
              <>
                <li>
                  <Link
                    onClick={(e) => {
                      Logout();
                    }}
                    to=""
                  >
                    Logout
                  </Link>
                </li>
                <li>
                  <Link to={process.env.PUBLIC_URL + "/my-account"}>
                    My account
                  </Link>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link to={process.env.PUBLIC_URL + "/login-register"}>
                    Login
                  </Link>
                </li>
                <li>
                  <Link to={process.env.PUBLIC_URL + "/login-register"}>
                    Register
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
      {/* <div className="same-style header-compare">
        <Link to={process.env.PUBLIC_URL + "/compare"}>
          <i className="pe-7s-shuffle" />
          <span className="count-style">
            {compareData && compareData.length ? compareData.length : 0}
          </span>
        </Link>
      </div> */}
      {/* <div className="same-style header-wishlist">
        <Link to={process.env.PUBLIC_URL + "/wishlist"}>
          <i className="pe-7s-like" />
          <span className="count-style">
            {wishlistData && wishlistData.length ? wishlistData.length : 0}
          </span>
        </Link>
      </div> */}
      <div className="same-style cart-wrap d-none d-lg-block">
        <button className="icon-cart" onClick={(e) => handleClick(e)}>
          <i className="pe-7s-shopbag" />
          <span className="count-style">
            {cartData && cartData.length ? cartData.length : 0}
          </span>
        </button>
        {/* menu cart */}
        <MenuCart
          cartData={cartData}
          currency={currency}
          deleteFromCart={deleteFromCart}
        />
      </div>
      <div className="same-style cart-wrap d-block d-lg-none">
        <Link className="icon-cart" to={process.env.PUBLIC_URL + "/cart"}>
          <i className="pe-7s-shopbag" />
          <span className="count-style">
            {cartData && cartData.length ? cartData.length : 0}
          </span>
        </Link>
      </div>
      <div className="same-style mobile-off-canvas d-block d-lg-none">
        <button
          className="mobile-aside-button"
          onClick={() => triggerMobileMenu()}
        >
          <i className="pe-7s-menu" />
        </button>
      </div>
    </div>
  );
};

IconGroup.propTypes = {
  cartData: PropTypes.array,
  compareData: PropTypes.array,
  currency: PropTypes.object,
  iconWhiteClass: PropTypes.string,
  deleteFromCart: PropTypes.func,
  wishlistData: PropTypes.array,
};

const mapStateToProps = (state) => {
  return {
    currency: state.currencyData,
    cartData: state.cartData,
    wishlistData: state.wishlistData,
    compareData: state.compareData,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    deleteFromCart: (item, addToast) => {
      dispatch(deleteFromCart(item, addToast));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(IconGroup);
