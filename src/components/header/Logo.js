import PropTypes from "prop-types";
import React from "react";
import { Link } from "react-router-dom";
import propcb from "../../assets/Pictures/logo-1.png";
const Logo = ({ imageUrl, logoClass }) => {
  return (
    <div className={`${logoClass ? logoClass : ""}`} style={{"margin":0,"padding":0}}>
      <Link to={process.env.PUBLIC_URL + "/"} >
        <img alt="PRO PCB" style={{"marginBottom":"1.5rem","marginTop":"1.5rem","height":"2rem","width":"7rem"}}  src={propcb} />
      </Link>
    </div>
  );
};

Logo.propTypes = {
  imageUrl: PropTypes.string,
  logoClass: PropTypes.string
};

export default Logo;
