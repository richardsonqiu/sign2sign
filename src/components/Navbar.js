import React from "react";
import { Link } from "react-router-dom";
import { useGlobalContext } from "../context";
import logo from "../logo.svg";

const Navbar = () => {
  const { userid, username } = useGlobalContext();
  return (
    <nav className="navbar">
      <div className="nav-center">
        <Link to="/">
          <img src={logo} alt="Sign2Sign Logo" />
        </Link>
        <ul className="nav-links">
          <li>
            <Link exact to="/">
              Home
            </Link>
          </li>
          <li>
            <Link to="/about">About</Link>
          </li>
          <li>
            <Link to="/profile">{username ? `${username}` : `Profile`}</Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
