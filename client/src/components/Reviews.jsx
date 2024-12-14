import React from "react";
import "../App.css";
import { useQuery } from "@apollo/client";
import queries from "../queries";
import { NavLink } from "react-router-dom";

function App() {
  const { loading, error, data } = useQuery(queries.GET_REVIEWS);

  let body = null;
  if (loading) {
    body = <p>Loading</p>;
  } else if (error) {
    body = <p>There was an error: {error.message}</p>;
  } else if (data) {
    let { reviews: reviewReverse } = data;
    let reviews = [...reviewReverse].reverse();
    body = (
      <>
        {/* {JSON.stringify(reviews)} */}
        <ul className="reviewList">
          {reviews.map((review) => (
            <li key={review._id}>
              <div>
                <h2>
                  <NavLink to={`/reviews/${review._id}`} className="link">
                    "{review.title}" - {review.user.username}
                  </NavLink>
                </h2>
                <h3>
                  A review of{" "}
                  <NavLink to={`/track/${review.track._id}`} className="link">
                    "{review.track.title}"
                  </NavLink>{" "}
                  by {review.track.artist}
                </h3>
                <a href={review.track.songUrl} className="link" target="_blank">
                  <br />
                  Listen here!
                </a>
              </div>
              <img src={review.track.imageUrl} className="art" />
            </li>
          ))}
        </ul>
      </>
    );
  }

  return (
    <>
      <h2 className="subtitle">Reviews</h2>
      {body}
    </>
  );
}

export default App;
