import React, { useContext } from "react";
import "../App.css";
import { AuthContext } from "../context/AuthContext";
import { Route, Routes } from "react-router-dom";

const Home = () => {
  const { currentUser } = useContext(AuthContext);
  return <div>{currentUser ? <HomeAuth /> : <HomeNonAuth />}</div>;
};

const HomeAuth = () => {
  const { currentUser } = useContext(AuthContext);
  return <p>You are logged in and ready to explore Harmonize!</p>;
};

const HomeNonAuth = () => {
  return <p>You are currently not logged in, you should do that.</p>;
};

export default Home;
