import React, { useContext } from "react";
import { NavLink } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import SignOutButton from "./SignOut";

import "../App.css";

const Navigation = () => {
  const { currentUser } = useContext(AuthContext);
  // console.log(JSON.stringify(currentUser));
  return <div>{currentUser ? <NavigationAuth /> : <NavigationNonAuth />}</div>;
};

const NavigationAuth = () => {
  const { currentUser } = useContext(AuthContext);
  return (
    <>
      <p>You are currently logged in.</p>
      <nav className="navigation">
        <NavLink className="NavLink" to="/">
          Home
        </NavLink>
        <NavLink className="NavLink" to="/reviews">
          Reviews
        </NavLink>
        <NavLink className="NavLink" to={`/user/${currentUser.uid}`}>
          Profile
        </NavLink>
        <NavLink className="NavLink" to="/createReview">
          Create Review
        </NavLink>
      </nav>
    </>
  );
};

const NavigationNonAuth = () => {
  return (
    <>
      <p>You are currently not logged in.</p>
      <nav className="navigation">
        <NavLink to="/signup" className="NavLink">
          Sign-up
        </NavLink>
        <NavLink to="/signin" className="NavLink">
          Sign-In
        </NavLink>
      </nav>
    </>
  );
};

export default Navigation;
