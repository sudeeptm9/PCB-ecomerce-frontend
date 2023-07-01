import PropTypes from "prop-types";
import React, { Fragment, useState } from "react";
import { Link } from "react-router-dom";
import MetaTags from "react-meta-tags";
import { connect } from "react-redux";
import { BreadcrumbsItem } from "react-breadcrumbs-dynamic";
// import { getDiscountPrice } from "../../helpers/product";
import LayoutOne from "../../layouts/LayoutOne";
import Breadcrumb from "../../wrappers/breadcrumb/Breadcrumb";
import Cookies from "universal-cookie";
import { useEffect } from "react";
import axios from "axios";
import { useToasts } from "react-toast-notifications";
import { useAsyncDeepState } from "use-async-effect2";
import { v4 as uuidv4 } from "uuid";

const Checkout = ({ location }) => {
  const [checkflag,setcheckflag]=useState(true);
  const { pathname } = location;
  const cookies = new Cookies();
  const email = cookies.get("Email") || null;
  let cartTotalPrice = 0;
  let [cartItems, setCartItems] = useState([]);
  const { addToast } = useToasts();
  const data = async () => {
    if (email != null) {
      let response = await axios.get(`http://localhost:8080/cart/${email}`);
      if (response.statusCode === 400) {
        console.log("Handle error");
      } else {
        cartItems = await response.data.arr;
        setCartItems(cartItems);
      }
    } else {
      setCartItems([]);
      return cartItems;
    }
  };
  useEffect(() => {
    data();
  }, []);
  const [billData, setBillData] = useAsyncDeepState({
    Firstname: "",
    Lastname: "",
    Companyname: "",
    Streetaddress1: "",
    Streetaddress2: "",
    city: "",
    state: "",
    zip: 0,
    phone: "",
    email: email,
    additionalInformation: "",
    total: 0,
    orderid: "",
    paymentid: "",
  });
  let [billid, setbillid] = useState("");
  const handleChange = (e) => {
    e.preventDefault();
    switch (e.target.name) {
      case "firstName":
        setBillData(({ state }) => ({
          ...state,
          Firstname: e.target.value,
        }));
        break;
      case "lastName":
        setBillData(({ state }) => ({ ...state, Lastname: e.target.value }));
        break;
      case "companyName":
        setBillData(({ state }) => ({
          ...state,
          Companyname: e.target.value,
        }));
        break;
      case "Streetaddress1":
        setBillData(({ state }) => ({
          ...state,
          Streetaddress1: e.target.value,
        }));
        break;
      case "Streetaddress2":
        setBillData(({ state }) => ({
          ...state,
          Streetaddress2: e.target.value,
        }));
        break;
      case "city":
        setBillData(({ state }) => ({ ...state, city: e.target.value }));
        break;
      case "state":
        setBillData(({ res }) => ({ ...res, state: e.target.value }));
        break;
      case "phone":
        setBillData(({ res }) => ({ ...res, phone: e.target.value }));
        break;
      // case "email":
      //   setBillData(({ res }) => ({ ...res, email: e.target.value }));
      //   break;
      case "zip":
        setBillData(({ res }) => ({ ...res, zip: e.target.value }));
        break;
      case "additionalInformation":
        setBillData(({ res }) => ({
          ...res,
          additionalInformation: e.target.value,
        }));
        break;
      default:
        console.log("Error");
    }
  };
  const handlePayment = async (orderid, billid, ouuid) => {
    var options = {
      key: "rzp_test_C1Oj1ATXARajxr",
      //    "amount": "49900",
      currency: "INR",
      name: "Pro PCB",
      // "description": "Pay & Checkout this Course, Upgrade your DSA Skill",
      //  "image": "",
      order_id: orderid,
      handler: async function (response) {
        await axios
          .post("http://localhost:8080/payment/verify", response, {
            headers: {
              "x-access-token": cookies.get("Authorization"),
              "x-razorpay-signature": response.razorpay_signature,
            },
          })
          .then(async (resrazor) => {
            addToast("Payment successful!!", {
              appearance: "success",
            });
            await axios
              .put(
                `http://localhost:8080/billing/${billid}`,
                {
                  oid: orderid,
                  pid: response.razorpay_payment_id,
                },
                {
                  headers: {
                    "x-access-token": cookies.get("Authorization"),
                  },
                }
              )
              .then(() => {
                ouuid.map(async (id) => {
                  await axios
                    .put(
                      `http://localhost:8080/order/${id}`,
                      {
                        oid: orderid,
                      },
                      {
                        headers: {
                          "x-access-token": cookies.get("Authorization"),
                        },
                      }
                    )
                    .then()
                    .catch(async () => {
                     if(setcheckflag){
                      delorder(billid, ouuid);
                      setcheckflag(false)
                     }
                    });
                });
               // shipment(orderid, billid, ouuid,response);
              })
              .catch(async () => {
                if(setcheckflag){
                  delorder(billid, ouuid);
                  setcheckflag(false);
                }
              });
          })
          .catch((err) => {
            addToast("Payment failed", {
              appearance: "success",
            });
            if(setcheckflag){
              delorder(billid, ouuid);
              setcheckflag(false);
            }
          });
      },
      theme: {
        color: "#2300a3",
      },
    };
    var razorpayObject = new window.Razorpay(options);
    razorpayObject.open();
    razorpayObject.on("payment.failed", function (response) {
      addToast("Payment failed", {
        appearance: "error",
      });
      if(setcheckflag){
        delorder(billid, ouuid);
        setcheckflag(false);
      }
    });
  };
  // const shipment = (paymentid, billid, orderidarr,response) => {
  //   axios
  //     .post("https://apiv2.shiprocket.in/v1/external/auth/login", {
  //       email: "venkatesh21np@gmail.com",
  //       password: "8310986566",
  //     })
  //     .then((authres) => {
  //       let date = new Date();
  //       let shippingData = {
  //         order_id: String(uuidv4()),
  //         order_date: `${date.getFullYear()}-${date.getMonth()}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}`,
  //         pickup_location: "Primary",
  //         channel_id: "3120210",
  //         comment: "order",
  //         billing_customer_name: billData.Firstname,
  //         billing_last_name: billData.Lastname,
  //         billing_address: billData.Streetaddress1,
  //         billing_address_2: billData.Streetaddress2,
  //         billing_city: billData.city,
  //         billing_pincode: billData.zip,
  //         billing_state: billData.state,
  //         billing_country: "India",
  //         billing_email: email,
  //         billing_phone: billData.phone,
  //         shipping_is_billing: true,
  //         shipping_customer_name: "VENKATESH N P",
  //         shipping_last_name: "",
  //         shipping_address: "Vinayakan",
  //         shipping_address_2: "Tumkur",
  //         shipping_city: "Tumkur",
  //         shipping_pincode: "572101",
  //         shipping_country: "India",
  //         shipping_state: "Karnataka",
  //         shipping_email: "venki21122@gmail.com",
  //         shipping_phone: "8310986566",
  //         order_items: [
  //           {
  //             name: "PCB",
  //             sku: "1",
  //             units: cartItems.length,
  //             selling_price: billData.total,
  //             discount: "",
  //           },
  //         ],
  //         payment_method: "Prepaid",
  //         shipping_charges: 0,
  //         giftwrap_charges: 0,
  //         transaction_charges: 0,
  //         total_discount: 0,
  //         sub_total: billData.total,
  //         length: 10,
  //         breadth: 15,
  //         height: 20,
  //         weight: 2.5,
  //       };
  //       axios
  //         .post(
  //           "https://apiv2.shiprocket.in/v1/external/orders/create/adhoc",
  //           shippingData,
  //           {
  //             headers: {
  //               Authorization: `Bearer ${authres.data.token}`,
  //             },
  //           }
  //         )
  //         .then((shipres) => {
  //           axios
  //             .delete("http://localhost:8080/cart", {
  //               headers: {
  //                 "x-access-token": cookies.get("Authorization"),
  //               },
  //               data: {
  //                 id: "all",
  //                 email: email,
  //               },
  //             })
  //             .then(() => {
  //               addToast("Order placed successfully", {
  //                 appearance: "success",
  //               });
  //               setTimeout(() => window.location.reload(), 2000);
  //             })
  //             .catch(async () => {
  //               if(setcheckflag){
  //                 await axios.delete(
  //                   `http://localhost:8080/billing/${billid}`,
  //                   {
  //                     headers: {
  //                       "x-access-token": cookies.get("Authorization"),
  //                     },
  //                   }
  //                 );
  //                 orderidarr.map(async (id) => {
  //                   await axios.delete(`http://localhost:8080/order/${id}`, {
  //                     headers: {
  //                       "x-access-token": cookies.get("Authorization"),
  //                     },
  //                   });
  //                 });
  //                 setcheckflag(false);
  //               }
  //               axios.post(
  //                 `https://api.razorpay.com/v1/payments/${paymentid}/refund`,{
  //                   headers: {
  //                     "x-access-token": cookies.get("Authorization"),
  //                     "x-razorpay-signature": response.razorpay_signature,
  //                   },
  //                 }
  //               );
  //             });
  //         })
  //         .catch(() => {});
  //     })
  //     .catch(async (err) => {
  //       //refund, delete billing and order - shiprocket
  //      if(setcheckflag){
  //       await axios.delete(`http://localhost:8080/billing/${billid}`, {
  //         headers: {
  //           "x-access-token": cookies.get("Authorization"),
  //         },
  //       });
  //       orderidarr.map(async (id) => {
  //         await axios.delete(`http://localhost:8080/order/${id}`, {
  //           headers: {
  //             "x-access-token": cookies.get("Authorization"),
  //           },
  //         });
  //       });
          
  //       setcheckflag(false);

  //      }
  //       axios.post(`https://api.razorpay.com/v1/payments/${paymentid}/refund`,{
  //         headers: {
  //           "x-access-token": cookies.get("Authorization"),
  //           "x-razorpay-signature": response.razorpay_signature,
  //         },
  //       });
  //       addToast("Error while placing order! Please try again", {
  //         appearance: "error",
  //       });
  //       return;
  //     });
  // };
  const delorder = async (billid, orderidarr) => {
    await axios.delete(`http://localhost:8080/billing/${billid}`, {
      headers: {
        "x-access-token": cookies.get("Authorization"),
      },
    });
    orderidarr.map(async (id) => {
      await axios.delete(`http://localhost:8080/order/${id}`, {
        headers: { "x-access-token": cookies.get("Authorization") },
      });
    });
    addToast("Error while placing order! Please try again", {
      appearance: "error",
    });
  };
  const submit = async () => {
    let orderidarr = [];
    if (billData.zip.length != 6) {
      addToast("Please enter correct zip number", {
        appearance: "error",
      });
      return;
    }
    await axios
      .post("http://localhost:8080/billing/", billData, {
        headers: {
          "x-access-token": cookies.get("Authorization"),
        },
      })
      .then(async (res1) => {
        cartItems.map((cartItem) => {
          axios
            .post("http://localhost:8080/order/", cartItem, {
              headers: {
                "x-access-token": cookies.get("Authorization"),
              },
            })
            .then((res2) => {
              orderidarr.push(res2.data.oid);
            })
            .catch(async (err) => {
              // addToast("Error while placing order! Please try again", {
              //   appearance: "error",
              // });
              if(setcheckflag){
                await axios.delete(
                  `http://localhost:8080/billing/${res1.data.billid}`,
                  {
                    headers: {
                      "x-access-token": cookies.get("Authorization"),
                    },
                  }
                );
                orderidarr.map(async (id) => {
                  await axios.delete(`http://localhost:8080/order/${id}`, {
                    headers: { "x-access-token": cookies.get("Authorization") },
                  });
                });
                console.log("err");
                setcheckflag(false);
                throw new Error();
              }
            });
        });
        await axios
          .post(
            "http://localhost:8080/payment/orders",
            { amount: cartTotalPrice },
            {
              headers: {
                "x-access-token": cookies.get("Authorization"),
              },
            }
          )
          .then(async (res) => {
            handlePayment(res.data.data.id, res1.data.billid, orderidarr);
          })
          .catch(async (err) => {
            //delete billing and order - api payment
            if(checkflag){
              await axios.delete(
                `http://localhost:8080/billing/${res1.data.billid}`,
                {
                  headers: {
                    "x-access-token": cookies.get("Authorization"),
                  },
                }
              );
              orderidarr.map(async (id) => {
                await axios.delete(`http://localhost:8080/order/${id}`, {
                  headers: { "x-access-token": cookies.get("Authorization") },
                });
              });
              setcheckflag(false);
              throw new Error();
            }
            
          });
      })
      .catch(() => {
        //billing post api call
        addToast("Error while placing order! Please try again", {
          appearance: "error",
        });
      });
  };
  return (
    <Fragment>
      <MetaTags>
        <title>ProPCB | Checkout</title>
        <meta name="description" content="Checkout page." />
      </MetaTags>
      <BreadcrumbsItem to={process.env.PUBLIC_URL + "/"}>Home</BreadcrumbsItem>
      <BreadcrumbsItem to={process.env.PUBLIC_URL + pathname}>
        Checkout
      </BreadcrumbsItem>
      <LayoutOne>
        {/* breadcrumb */}
        <Breadcrumb />
        <div className="checkout-area pt-95 pb-100">
          <div className="container">
            {cartItems && cartItems.length >= 1 ? (
              <div className="row">
                {/* <form> */}
                <div className="col-lg-7">
                  <div className="billing-info-wrap">
                    <h3>Billing Details</h3>

                    <div className="row">
                      <div className="col-lg-6 col-md-6">
                        <div className="billing-info mb-20">
                          <label>First Name</label>
                          <input
                            type="text"
                            name="firstName"
                            onChange={handleChange}
                            required
                          />
                        </div>
                      </div>
                      <div className="col-lg-6 col-md-6">
                        <div className="billing-info mb-20">
                          <label>Last Name</label>
                          <input
                            type="text"
                            name="lastName"
                            onChange={handleChange}
                            required
                          />
                        </div>
                      </div>
                      <div className="col-lg-12">
                        <div className="billing-info mb-20">
                          <label>Company Name</label>
                          <input
                            type="text"
                            name="companyName"
                            onChange={handleChange}
                            required
                          />
                        </div>
                      </div>
                      {/* <div className="col-lg-12">
                        <div className="billing-select mb-20">
                          <label>Country</label>
                          <select>
                            <option>Select a country</option>
                            <option>Azerbaijan</option>
                            <option>Bahamas</option>
                            <option>Bahrain</option>
                            <option>Bangladesh</option>
                            <option>Barbados</option>
                          </select>
                        </div>
                      </div> */}
                      <div className="col-lg-12">
                        <div className="billing-info mb-20">
                          <label>Street Address</label>
                          <input
                            className="billing-address"
                            placeholder="House number and street name"
                            type="text"
                            name="Streetaddress1"
                            onChange={handleChange}
                            required
                          />
                          <input
                            placeholder="Apartment, suite, unit etc."
                            type="text"
                            name="Streetaddress2"
                            onChange={handleChange}
                            required
                          />
                        </div>
                      </div>
                      <div className="col-lg-12">
                        <div className="billing-info mb-20">
                          <label>Town / City</label>
                          <input
                            type="text"
                            name="city"
                            onChange={handleChange}
                            required
                          />
                        </div>
                      </div>
                      <div className="col-lg-6 col-md-6">
                        <div className="billing-info mb-20">
                          <label>State / County</label>
                          <input
                            type="text"
                            name="state"
                            onChange={handleChange}
                            required
                          />
                        </div>
                      </div>
                      <div className="col-lg-6 col-md-6">
                        <div className="billing-info mb-20">
                          <label>Postcode / ZIP</label>
                          <input
                            type="number"
                            name="zip"
                            onChange={handleChange}
                            required
                          />
                        </div>
                      </div>
                      <div className="col-lg-6 col-md-6">
                        <div className="billing-info mb-20">
                          <label>Phone</label>
                          <input
                            type="text"
                            name="phone"
                            onChange={handleChange}
                            required
                          />
                        </div>
                      </div>
                      {/* <div className="col-lg-6 col-md-6">
                          <div className="billing-info mb-20">
                            <label>Email Address</label>
                            <input
                              type="text"
                              name="email"
                              onChange={handleChange}
                              required
                            />
                          </div>
                        </div> */}
                    </div>

                    <div className="additional-info-wrap">
                      <h4>Additional information</h4>
                      <div className="additional-info">
                        <label>Order notes</label>
                        <textarea
                          placeholder="Notes about your order, e.g. special notes for delivery. "
                          name="additionalInformation"
                          defaultValue={""}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-lg-5">
                  <div className="your-order-area">
                    <h3>Your order</h3>
                    <div className="your-order-wrap gray-bg-4">
                      <div className="your-order-product-info">
                        <div className="your-order-top">
                          <ul>
                            <li>Product</li>
                            <li>Total</li>
                          </ul>
                        </div>
                        <div className="your-order-middle">
                          <ul>
                            {cartItems.map((cartItem, key) => {
                              // const discountedPrice = getDiscountPrice(
                              //   cartItem.price,
                              //   cartItem.discount
                              // );
                              // const finalProductPrice = (
                              //   cartItem.price * currency.currencyRate
                              // ).toFixed(2);
                              // const finalDiscountedPrice = (
                              //   discountedPrice * currency.currencyRate
                              // ).toFixed(2);

                              // discountedPrice != null
                              //   ? (cartTotalPrice +=
                              //       finalDiscountedPrice * cartItem.quantity)
                              //   : (cartTotalPrice +=
                              //       finalProductPrice * cartItem.quantity);
                              cartTotalPrice += cartItem.total;
                              return (
                                <li key={key}>
                                  <span className="order-middle-left">
                                    {cartItem.product_type} X{" "}
                                    {cartItem.quantity}
                                  </span>{" "}
                                  <span className="order-price">
                                    {/* {discountedPrice !== null
                                      ? currency.currencySymbol +
                                        (
                                          finalDiscountedPrice *
                                          cartItem.quantity
                                        ).toFixed(2)
                                      : currency.currencySymbol +
                                        (
                                          finalProductPrice * cartItem.quantity
                                        ).toFixed(2)} */}
                                    {cartItem.total}
                                  </span>
                                </li>
                              );
                            })}
                          </ul>
                        </div>
                        <div className="your-order-bottom">
                          <ul>
                            <li className="your-order-shipping">Shipping</li>
                            <li>Free shipping</li>
                          </ul>
                        </div>
                        <div className="your-order-total">
                          <ul>
                            <li className="order-total">Total</li>
                            <li>₹ {cartTotalPrice.toFixed(2)}</li>
                          </ul>
                        </div>
                      </div>
                      {/* <div className="payment-method"></div> */}
                    </div>
                    <div className="place-order mt-25">
                      <button
                        className="btn-hover"
                        type="submit"
                        onClick={submit}
                      >
                        Place Order
                      </button>
                    </div>
                  </div>
                </div>
                {/* </form> */}
              </div>
            ) : (
              <div className="row">
                <div className="col-lg-12">
                  <div className="item-empty-area text-center">
                    <div className="item-empty-area__icon mb-30">
                      <i className="pe-7s-cash"></i>
                    </div>
                    <div className="item-empty-area__text">
                      No items found in cart to checkout <br />{" "}
                      <Link to={process.env.PUBLIC_URL + "/quote"}>
                        Shop Now
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </LayoutOne>
    </Fragment>
  );
};

Checkout.propTypes = {
  cartItems: PropTypes.array,
  currency: PropTypes.object,
  location: PropTypes.object,
};

const mapStateToProps = (state) => {
  return {
    cartItems: state.cartData,
    currency: state.currencyData,
  };
};

export default connect(mapStateToProps)(Checkout);
