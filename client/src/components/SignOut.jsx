import React from "react";
import { doSignOut } from "../firebase/FirebaseFunctions";
import { useNavigate } from "react-router-dom";
const SignOutButton = () => {
  let navigate = useNavigate();
  function innerSignOut() {
    doSignOut();
    navigate("/");
  }
  return (
    <button className="signOutButton" type="button" onClick={innerSignOut}>
      Sign Out
    </button>
  );
};

export default SignOutButton;
