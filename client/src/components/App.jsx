import React from "react";
import "../App.css";
import { Route, Routes } from "react-router-dom";
import Navigation from "./Navigation";
import SignIn from "./SignIn";
import SignUp from "./SignUp";
import Home from "./Home";
import Reviews from "./Reviews";
import OneReview from "./OneReview";
import OneTrack from "./OneTrack";
import OneAlbum from "./OneAlbum";
import User from "./User";
import CreateReview from "./CreateReview";
import { AuthProvider } from "../context/AuthContext";
import SignOutButton from "./SignOut";
import PrivateRoute from "./PrivateRoute";

function App() {
  return (
    <AuthProvider>
      <div className="App">
        <header className="App-header">
          <h1 className="AppTitle">HARMONIZE</h1>
          <Navigation />
        </header>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/reviews" element={<PrivateRoute />}>
            <Route path="/reviews" element={<Reviews />} />
          </Route>
          <Route path="/reviews/:id" element={<PrivateRoute />}>
            <Route path="/reviews/:id" element={<OneReview />} />
          </Route>
          <Route path="/track/:id" element={<PrivateRoute />}>
            <Route path="/track/:id" element={<OneTrack />} />
          </Route>
          <Route path="/user/:userId" element={<PrivateRoute />}>
            <Route path="/user/:userId" element={<User />} />
          </Route>
          <Route path="/album/:id" element={<PrivateRoute />}>
            <Route path="/album/:id" element={<OneAlbum />} />
          </Route>
          <Route path="/createReview" element={<PrivateRoute />}>
            <Route path="/createReview" element={<CreateReview />} />
          </Route>
        </Routes>
        <SignOutButton></SignOutButton>
      </div>
    </AuthProvider>
  );
}

export default App;
