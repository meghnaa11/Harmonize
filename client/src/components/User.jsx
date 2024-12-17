import React from "react";
import { useParams } from "react-router-dom"; // Import useParams
import { useQuery } from "@apollo/client";
import queries from "../queries";

function User() {
  const { userId } = useParams(); // Extract userId from URL params

  const { loading, error, data } = useQuery(queries.GET_USER_BY_ID, {
    variables: { userId },
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const { username, email, reviews } = data.getUserById;

  return (
    <div className="user-profile">
   <div className="profile-header">
        <h1>{username}'s Profile</h1>
        <p><strong>Email:</strong> {email}</p>
      </div>
  
  <div className="reviews">
    <h2>Reviews</h2>
    {reviews.length > 0 ? (
      reviews.map((review) => (
        <div key={review._id} className="reviewCard">
          <h3>{review.title}</h3>
          <p>{review.content}</p>
          <p>
            <strong>Track:</strong> {review.track.title} by {review.track.artist}
          </p>
          <img
            src={review.track.imageUrl}
            alt={review.track.title}
            className="art"
          />
        </div>
      ))
    ) : (
      <p>No reviews yet.</p>
    )}
  </div>
</div>
  );
}

export default User;
