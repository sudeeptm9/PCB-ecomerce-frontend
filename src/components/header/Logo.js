import PropTypes from "prop-types";
import React from "react";
import { Link } from "react-router-dom";
const Logo = ({ imageUrl, logoClass }) => {
  return (
    <div className={`${logoClass ? logoClass : ""}`} style={{"margin":0,"padding":0}}>
      <Link to={process.env.PUBLIC_URL + "/"} >
        <img alt="PRO PCB" style={{"margin":0,"padding":0,"height":"7rem","width":"7rem"}}  src="https://propcb.s3.ap-south-1.amazonaws.com/logo-1.png" />
      </Link>
    </div>
  );
};

Logo.propTypes = {
  imageUrl: PropTypes.string,
  logoClass: PropTypes.string
};

export default Logo;
