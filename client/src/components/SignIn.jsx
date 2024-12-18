import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import {
  doSignInWithEmailAndPassword,
  doPasswordReset,
} from "../firebase/FirebaseFunctions";

function SignIn() {
  const { currentUser } = useContext(AuthContext);
  const handleLogin = async (event) => {
    event.preventDefault();
    let { email, password } = event.target.elements;

    try {
      await doSignInWithEmailAndPassword(email.value, password.value);
    } catch (error) {
      alert(error);
    }
  };

  const passwordReset = (event) => {
    event.preventDefault();
    let email = document.getElementById("email").value;
    if (email) {
      doPasswordReset(email);
      alert("Password reset email was sent");
    } else {
      alert(
        "Please enter an email address below before you click the forgot password link"
      );
    }
  };
  if (currentUser) {
    return <Navigate to="/" />;
  }
  return (
    <div>
      <div className="card text-center">
        <h1>Sign-In</h1>
        <form className="form" onSubmit={handleLogin}>
          <div className="form-group">
            <label>
              Email Address:
              <br />
              <input
                className="text-input"
                name="email"
                id="email"
                type="email"
                placeholder="Email"
                required
                autoFocus={true}
              />
            </label>
          </div>
          <br />
          <div className="form-group">
            <label>
              Password:
              <br />
              <input
                className="text-input"
                name="password"
                type="password"
                placeholder="Password"
                autoComplete="off"
                required
              />
            </label>
          </div>

        <div className="text-center">
            <button className="button NavLink background-green" style={{width: '100%', maxWidth: '400px'}} type="submit">
              Log in
            </button>
            <br />
            <button className="forgotPassword NavLink" style={{ 'marginTop': '0px' }} onClick={passwordReset}>
              Forgot Password
            </button>
          </div>
        </form>

        <br />
      </div>
    </div>
  );
}

export default SignIn;
