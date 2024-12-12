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
    let { reviews } = data;
    body = (
      <>
        {/* {JSON.stringify(reviews)} */}
        <ul>
          {reviews.map((review) => (
            <li key={review._id}>
              <h3>
                <NavLink to={`/reviews/${review._id}`}>
                  "{review.title}" - {review.user.username}
                </NavLink>
              </h3>
              <h4>
                A review of "{review.track.title}" by {review.track.artist}
              </h4>
              <img src={review.track.imageUrl} className="art" />
            </li>
          ))}
        </ul>
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
