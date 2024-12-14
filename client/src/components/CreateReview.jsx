import React, { useContext, useState } from "react";
import "../App.css";
import { AuthContext } from "../context/AuthContext";
import * as v from "../validation";
import { useQuery, useMutation } from "@apollo/client";
import queries from "../queries";
import { useNavigate } from "react-router-dom";

const CreateReview = () => {
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [createReview] = useMutation(queries.CREATE_REVIEW);
  const {
    error: trackError,
    loading: trackLoading,
    data: trackData,
  } = useQuery(queries.SEARCH_TRACKS_BY_NAME, {
    variables: {
      searchTerm: searchTerm,
    },
  });
  const uuid = currentUser.uid;

  function handleSearch(event) {
    event.preventDefault(event);
    let trackSearch = document.getElementById("trackSearch").value;
    try {
      trackSearch = v.vTrackSearch(trackSearch);
      setSearchTerm(trackSearch);
    } catch (e) {
      alert(e);
      setSearchTerm();
    }
  }
  function handleSubmit(event) {
    event.preventDefault();
    let trackIdString = document.getElementById("dropdown");
    if (trackIdString === null || trackIdString.value === "") {
      alert("No track selected!");
    } else {
      trackIdString = trackIdString.value;
      let titleString = document.getElementById("reviewTitle").value;
      let contentString = document.getElementById("reviewContent").value;
      try {
        titleString = v.vTitle(titleString);
        contentString = v.vContent(contentString);
        createReview({
          variables: {
            title: titleString,
            content: contentString,
            userId: uuid,
            trackId: trackIdString,
          },
        });
        alert("Your review has been created!");
        navigate("/reviews");
      } catch (e) {
        alert(e);
      }
    }
  }

  let dropdown = null;
  if (trackData) {
    let { searchTracksByName: tracks } = trackData;
    dropdown = (
      <select id="dropdown">
        {tracks.map((track) => (
          <option key={track._id} value={track._id}>
            "{track.title}" by {track.artist}
          </option>
        ))}
      </select>
    );
  } else if (trackError) {
    dropdown = (
      <select>
        <option value=""></option>
      </select>
    );
  } else if (trackLoading) {
    dropdown = (
      <select>
        <option value="" defaultValue="">
          Loading tracks...
        </option>
      </select>
    );
  }
  return (
    <>
      <h2>Create a Review</h2>
      <div>
        <form onSubmit={handleSearch}>
          <label htmlFor="trackSearch">
            Search for a track (can type track name and/or artist):
            <br />
            <input id="trackSearch" />
          </label>
          <button id="search" type="submit">
            Search!
          </button>
        </form>
      </div>
      <div>
        <form onSubmit={handleSubmit}>
          {dropdown} <br />
          <label htmlFor="reviewTitle">
            Title:
            <input id="reviewTitle" />
          </label>{" "}
          <br />
          <label htmlFor="reviewTitle">
            Content:
            <textarea id="reviewContent" />
          </label>{" "}
          <br />
          <button type="submit">Post!</button>
        </form>
      </div>
    </>
  );
};

export default CreateReview;
