import React from "react";
import "../App.css";
import { useQuery } from "@apollo/client";
import queries from "../queries";
import { NavLink, useParams } from "react-router-dom";

function App() {
  const { id } = useParams();
  const { loading, error, data } = useQuery(queries.GET_REVIEW_BY_ID, {
    variables: {
      reviewId: id,
    },
  });
  let body = null;
  if (loading) {
    body = <p>Loading</p>;
  } else if (error) {
    body = <p>There was an error: {error.message}</p>;
  } else if (data) {
    let { getReviewById: review } = data;
    // console.log(data);
    body = (
      <>
        {/* {JSON.stringify(reviews)} */}
        <h2>"{review.title}"</h2>
        <h3>
          A review of{" "}
          <NavLink to={`/track/${review.track._id}`}>
            "{review.track.title}" off the album "{review.track.album.title}".
          </NavLink>{" "}
          by {review.track.artist}
        </h3>
        <img src={review.track.imageUrl} className="art" />
        <h4>A review by {review.user.username}</h4>
        <p>Review Text: {review.content}</p>
      </>
    );
  }

  return (
    <>
      <h2>Reviews</h2>
      {body}
    </>
  );
}

export default App;
