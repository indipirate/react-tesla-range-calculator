import React from "react";
import logoUrl from "../../assets/logo.svg";
import "./Header.css";

const Header = () => (
  <div className="header">
    {" "}
    <img src={logoUrl} alt="Tesla" />{" "}
  </div>
);

export default Header;
