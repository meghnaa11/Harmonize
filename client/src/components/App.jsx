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
import { AuthProvider } from "../context/AuthContext";
import SignOutButton from "./SignOut";
import PrivateRoute from "./PrivateRoute";

function App() {
  return (
    <AuthProvider>
      <div className="App">
        <header className="App-header card">
          <h1>Harmonize</h1>
          <Navigation />
        </header>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/reviews" element={<Reviews />} />
          <Route path="/reviews/:id" element={<OneReview />} />
          <Route path="/track/:id" element={<OneTrack />} />
          <Route path="/user/:userId" element={<User />} />
          <Route path="/album/:id" element={<OneAlbum />} />
        </Routes>
      </div>
    </AuthProvider>
  );
}

export default App;
