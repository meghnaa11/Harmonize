import React, { useContext } from "react";
import { NavLink } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import SignOutButton from "./SignOut";
import "../App.css";

const Navigation = () => {
  const { currentUser } = useContext(AuthContext);
  return <div>{currentUser ? <NavigationAuth /> : <NavigationNonAuth />}</div>;
};

const NavigationAuth = () => {
  const { currentUser } = useContext(AuthContext);
  return (
    <nav className="navigation">
      <p>You are currently logged in as: {currentUser.displayName}</p>
      <SignOutButton></SignOutButton>
    </nav>
  );
};

const NavigationNonAuth = () => {
  return (
    <nav className="navigation">
      <p>You are currently not logged in.</p>
      <ul>
        <li>
          <NavLink to="/signup">Sign-up</NavLink>
        </li>
        <li>
          <NavLink to="/signin">Sign-In</NavLink>
        </li>
      </ul>
    </nav>
  );
};

export default Navigation;
