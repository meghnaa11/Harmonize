import React, { useContext, useState } from "react";
import "../App.css";
import { AuthContext } from "../context/AuthContext";
import * as v from "../validation";
import { useQuery, useMutation } from "@apollo/client";
import queries from "../queries";
import { useNavigate, useLocation } from "react-router-dom";

const CreateReview = () => {
  const location = useLocation();
  const { defaultTrackId, defaultTrackTitle, defaultTrackArtist } =
    location.state || {};
  console.log(defaultTrackArtist, defaultTrackId, defaultTrackTitle);
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [createReview] = useMutation(queries.CREATE_REVIEW, {
    update(cache, { data: { createReview } }) {
      try {
        const { reviews } = cache.readQuery({
          query: queries.GET_REVIEWS,
        });
        if (reviews) {
          cache.writeQuery({
            query: queries.GET_REVIEWS,
            data: {
              reviews: [...reviews, createReview],
            },
          });
        }
        const trackId = createReview.track._id;
        const { getTrackReviews } = cache.readQuery({
          query: queries.GET_TRACK_REVIEWS,
          variables: { trackId },
        });

        if (getTrackReviews) {
          cache.writeQuery({
            query: queries.GET_TRACK_REVIEWS,
            variables: { trackId },
            data: {
              getTrackReviews: [...getTrackReviews, createReview],
            },
          });
        }
      } catch (error) {
        console.error("Error updating cache:", error);
      }
    },
  });

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
  async function handleSubmit(event) {
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
        let response = await createReview({
          variables: {
            title: titleString,
            content: contentString,
            userId: uuid,
            trackId: trackIdString,
          },
        });
        alert("Review successfully created!");
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
      <select id="dropdown" style={{maxWidth: '515px'}}>
        {tracks.map((track) => (
          <option key={track._id} value={track._id}>
            "{track.title}" by {track.artist}
          </option>
        ))}
      </select>
    );
  } else if (trackError) {
    dropdown = (
      <select id="dropdown" style={{maxWidth: '515px'}}>
        <option value={defaultTrackId}>
          "{defaultTrackTitle}" by {defaultTrackArtist}
        </option>
      </select>
    );
  } else if (trackLoading) {
    dropdown = (
      <select id="dropdown">
        <option value="" defaultValue="">
          Loading tracks...
        </option>
      </select>
    );
  }
  return (
    <>
      <h2 className="subtitle">Create a Review</h2>
      <div className="formCard text-center">
        <form onSubmit={handleSearch}>
          <label htmlFor="trackSearch">
            {/* Track: */}
            <br />
            <input id="trackSearch" defaultValue={defaultTrackTitle} placeholder="Search By Artist/Song/Album" className="text-input my-10" />
          </label>
          <button id="search" type="submit" className="NavLink" style={{marginLeft: '10px'}}>
            Search!
          </button>
        </form>
        <form onSubmit={handleSubmit}>
          {dropdown} <br />
          <label htmlFor="reviewTitle">
            {/* Title: <br></br> */}
            <input id="reviewTitle" className="my-5" placeholder='Enter title of your review' style={{marginTop: "30px"}}/>
          </label>{" "}
          <br />
          <label htmlFor="reviewTitle">
            {/* Content:<br></br> */}
            <textarea id="reviewContent" placeholder='Enter comment' className="my-5"/>
          </label>{" "}
          <br />
          <button type="submit" className="NavLink my-5">Post!</button>
        </form>
      </div>
    </>
  );
};

export default CreateReview;
