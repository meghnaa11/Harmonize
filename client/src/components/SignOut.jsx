import React from "react";
import { doSignOut } from "../firebase/FirebaseFunctions";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
const SignOutButton = () => {
  const { currentUser } = useContext(AuthContext);
  let navigate = useNavigate();
  function innerSignOut() {
    doSignOut();
    navigate("/");
  }
  if (currentUser) {
    return (
      <button className="signOutButton" type="button" onClick={innerSignOut}>
        Sign Out
      </button>
    );
  }
};

export default SignOutButton;
