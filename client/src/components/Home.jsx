import React, { useContext } from "react";
import "../App.css";
import { AuthContext } from "../context/AuthContext";
import { Route, Routes } from "react-router-dom";

const Home = () => {
  const { currentUser } = useContext(AuthContext);
  return (
    <div className="homeCard">
      {currentUser ? <HomeAuth /> : <HomeNonAuth />}
    </div>
  );
};

const homeText = (
  <p>
    Harmonize, seeks to redefine the music discovery experience by providing a
    social platform where users can discover, share, and discuss music in a
    community-driven way. The current state of music discovery heavily relies on
    the recommendation algorithms of platforms like Spotify and Apple Music,
    which are designed primarily for individual listening. Through in-built
    music integrations, user-generated reviews, real-time interactions, and
    compatibility features, Harmonize aims to make music discovery a more
    collaborative process. Key features of the app include the ability for users
    to listen and review tracks, engage with the community through comments, and
    search for music using filters like genre and rating. Social features such
    as messaging, following users, and showcasing music compatibility add a more
    interactive layer to the experience. Group chats based on music interests
    allow users to engage in discussions, share playlists, and attend virtual
    listening sessions.
  </p>
);
const HomeAuth = () => {
  const { currentUser } = useContext(AuthContext);
  return (
    <>
      <p>You are logged in and ready to explore Harmonize!</p>
      {homeText}
    </>
  );
};

const HomeNonAuth = () => {
  return (
    <>
      <p>You are currently not logged in, you should do that.</p>
      {homeText}
    </>
  );
};

export default Home;
