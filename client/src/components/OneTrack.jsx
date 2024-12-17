import React from "react";
import "../App.css";
import { useQuery } from "@apollo/client";
import queries from "../queries";
import { NavLink, useParams, useNavigate } from "react-router-dom";

function App() {
  const navigate = useNavigate();
  const { id } = useParams();
  const {
    loading: trackLoading,
    error: trackError,
    data: trackData,
  } = useQuery(queries.GET_TRACK_BY_ID, {
    variables: {
      trackId: id,
    },
  });
  const {
    loading: reviewsLoading,
    error: reviewsError,
    data: reviewsData,
  } = useQuery(queries.GET_TRACK_REVIEWS, {
    variables: {
      trackId: id,
    },
  });

  let body = null;
  let reviewButton = null;
  if (trackLoading) {
    body = <p>Loading...</p>;
  } else if (trackError) {
    body = <p>There was an error: {trackError.message}</p>;
  } else if (trackData) {
    let { getTrackById: track } = trackData;
    body = (
      <>
        {/* {JSON.stringify(reviews)} */}
        <div className="trackCard">
          <div>
            <h2>"{track.title}"</h2>
            <a href={track.songUrl} className="link" target="_blank">
              Listen here!
            </a>
          </div>
          <h3>By: {track.artist}</h3>
          <h3>
            On:{" "}
            <NavLink to={`/album/${track.album._id}`} className="link">
              {track.album.title}
            </NavLink>
          </h3>
          <img src={track.imageUrl} className="art" />
        </div>
      </>
    );
    reviewButton = (
      <button
        onClick={() => {
          console.log(track);
          navigate("/createReview", {
            state: {
              defaultTrackId: track._id,
              defaultTrackTitle: track.title,
              defaultTrackArtist: track.artist,
            },
          });
        }}
        className="reviewSuggest"
      >
        Review this track!
      </button>
    );
  }

  let reviewBody = null;

  if (reviewsLoading) {
    reviewBody = (
      <>
        <h3>Reviews</h3>
        <p>Loading...</p>
      </>
    );
  } else if (reviewsError) {
    reviewBody = (
      <>
        <h3>Reviews</h3>
        <p>There was an error: {reviewsError.message}</p>
      </>
    );
  } else if (reviewsData) {
    let { getTrackReviews: reviewList } = reviewsData;
    console.log(reviewList);
    if (reviewList.length === 0) {
      reviewBody = (
        <>
          <h3>Reviews</h3>
          <p>There are no reviews for this track yet.</p>
        </>
      );
    } else {
      reviewBody = (
        <>
          <div className="trackReviewsCard">
            <h3>Reviews</h3>
            <ul>
              {reviewList.map((review) => (
                <li key={review._id}>
                  <p>
                    <NavLink to={`/reviews/${review._id}`} className="link">
                      "{review.title}"
                    </NavLink>{" "}
                    by{" "}
                    <NavLink to={`/user/${review.user._id}`} className="link">
                      "{review.user.username}"
                    </NavLink>{" "}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </>
      );
    }
  }

  return (
    <>
      <h2 className="subtitle">Track</h2>
      {body}
      {reviewButton}
      {reviewBody}
    </>
  );
}

export default App;
