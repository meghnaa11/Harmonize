import React from "react";
import "../App.css";
import { Route, Routes, NavLink } from "react-router-dom";
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
import Messages from "./Messages";


function App() {
  return (
    <AuthProvider>
      <div className="App">
        <header className="App-header">
        <NavLink to="/" className="AppTitleLink">
            <h1 className="AppTitle">HARMONIZE</h1>
          </NavLink>
          <Navigation />
        </header>
        <div className="container">
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
          <Route path="/messages" element={<PrivateRoute />}>
            <Route path="/messages" element={<Messages />} />
          </Route>
        </Routes>
        </div>
      </div>
    </AuthProvider>
  );
}

export default App;
