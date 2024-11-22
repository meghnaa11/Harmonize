import React from "react";
import "../App.css";
import { Route, Routes } from "react-router-dom";
import Navigation from "./Navigation";
import SignIn from "./SignIn";
import SignUp from "./SignUp";
import Home from "./Home";
import { AuthProvider } from "../context/AuthContext";
import PrivateRoute from "./PrivateRoute";

function App() {
  return (
    <AuthProvider>
      <div className="App">
        <header className="App-header card">
          <Navigation />
        </header>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
        </Routes>
      </div>
    </AuthProvider>
  );
}

export default App;
