import React, { useContext, useState } from "react";
import { Navigate } from "react-router-dom";
import { doCreateUserWithEmailAndPassword } from "../firebase/FirebaseFunctions";
import { AuthContext } from "../context/AuthContext";
import { useMutation } from "@apollo/client";
import queries from "../queries";

function SignUp() {
  const { currentUser } = useContext(AuthContext);
  const [pwMatch, setPwMatch] = useState("");
  const [createUser, { loading, error }] = useMutation(queries.CREATE_USER);

  const handleSignUp = async (e) => {
    e.preventDefault();
    const { displayName, email, passwordOne, passwordTwo } = e.target.elements;

    if (passwordOne.value !== passwordTwo.value) {
      setPwMatch("Passwords do not match");
      return false;
    }

    try {
      const user = await doCreateUserWithEmailAndPassword(
        email.value,
        passwordOne.value,
        displayName.value
      );
      // console.log(JSON.stringify(user));
      await createUser({
        variables: {
          uuid: user.uid,
          username: displayName.value,
          email: email.value,
        },
      });
      alert("User successfully created!");
    } catch (error) {
      alert("Error signing up: " + error.message);
    }
  };

  if (currentUser) {
    return <Navigate to="/" />;
  }

  return (
    <div className="card text-center">
      <h1>Sign up</h1>
      {pwMatch && <h4 className="error">{pwMatch}</h4>}
      {error && <h4 className="error">{error.message}</h4>}
      <form onSubmit={handleSignUp}>
        <div className="form-group">
          <label>
            Username:
            <br />
            <input
              className="form-control text-input"
              required
              name="displayName"
              type="text"
              placeholder="Name"
              autoFocus={true}
            />
          </label>
        </div>
        <div className="form-group ">
          <label>
            Email:
            <br />
            <input
              className="form-control text-input"
              required
              name="email"
              type="email"
              placeholder="Email"
            />
          </label>
        </div>
        <div className="form-group">
          <label>
            Password:
            <br />
            <input
              className="form-control text-input"
              id="passwordOne"
              name="passwordOne"
              type="password"
              placeholder="Password"
              autoComplete="off"
              required
            />
          </label>
        </div>
        <div className="form-group">
          <label>
            Confirm Password:
            <br />
            <input
              className="form-control text-input"
              name="passwordTwo"
              type="password"
              placeholder="Confirm Password"
              autoComplete="off"
              required
            />
          </label>
        </div>
        <button
          className="button NavLink background-green"
          style={{width: '100%', maxWidth: '400px', 'marginTop': '15px'}}
          id="submitButton"
          name="submitButton"
          type="submit"
          disabled={loading}
        >
          {loading ? "Signing up..." : "Sign Up"}
        </button>
      </form>
      <br />
    </div>
  );
}

export default SignUp;
