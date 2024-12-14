import React, { useEffect } from "react";
import { useQuery } from "@apollo/client";
import queries from "../queries";

function User() {
  const { loading, error, data } = useQuery(queries.GET_REVIEWS);

  // Handle loading state
  if (loading) return <p>Loading...</p>;

  // Handle error state
  if (error) return <p>Error: {error.message}</p>;

  // Extract reviews data from query result
  const { reviews } = data;

  return (
    <div className="user-reviews-page">
      <h1>User Reviews</h1>
      <div className="reviews">
        {reviews.length > 0 ? (
          reviews.map((review) => (
            <div key={review._id} className="review">
              <h3>{review.title}</h3>
              <p><strong>User:</strong> {review.user.username}</p>
              <p><strong>Track:</strong> {review.track.title} by {review.track.artist}</p>
              <img src={review.track.imageUrl} alt={review.track.title} width="200" />
            </div>
          ))
        ) : (
          <p>No reviews found.</p>
        )}
      </div>
    </div>
  );
}

export default User;
