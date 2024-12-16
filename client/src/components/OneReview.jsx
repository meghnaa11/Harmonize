import React from "react";
import { useContext } from "react";
import "../App.css";
import { useQuery, useMutation } from "@apollo/client";
import queries from "../queries";
import { NavLink, useParams } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import * as v from "../validation";

function App() {
  const { id } = useParams();
  const { currentUser } = useContext(AuthContext);

  const { loading, error, data } = useQuery(queries.GET_REVIEW_BY_ID, {
    variables: {
      reviewId: id,
    },
  });

  const [createComment] = useMutation(queries.CREATE_COMMENT, {
    refetchQueries: [
      {
        query: queries.GET_REVIEW_BY_ID,
        variables: { reviewId: id },
      },
    ],
  });

  async function addComment(event) {
    event.preventDefault();
    try {
      let commentText = document.getElementById("comment").value;
      commentText = v.vContent(commentText);
      await createComment({
        variables: {
          reviewId: id,
          userId: currentUser.uid,
          text: commentText,
        },
      });
      document.getElementById("comment").value = "";
    } catch (error) {
      alert("Error adding comment: " + error.message);
    }
  }

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
        <div className="reviewCard">
          {/* {JSON.stringify(reviews)} */}
          <h2>"{review.title}"</h2>
          <h3>
            A review of{" "}
            <NavLink to={`/track/${review.track._id}`} className="link">
              "{review.track.title}"
            </NavLink>{" "}
            off the album{" "}
            <NavLink to={`/album/${review.track.album._id}`} className="link">
              "{review.track.album.title}"{" "}
            </NavLink>
            by {review.track.artist}
          </h3>
          <img src={review.track.imageUrl} className="art" />
          <a href={review.track.songUrl} className="link" target="_blank">
            <br></br>Listen here!
          </a>
          <h4>A review by {review.user.username}</h4>
          <p>Review Text: {review.content}</p>
        </div>
        <div className="reviewCard">
          <h4>Comments</h4>
          <form onSubmit={addComment}>
            <input type="text" placeholder="Write a comment." id="comment" />
            <button type="submit">Post</button>
          </form>
          <ul className="commentList">
            {review.comments.map((comment) => (
              <li key={comment._id}>
                <h3>{comment.user.username}</h3>
                <p>{comment.text}</p>
              </li>
            ))}
          </ul>
        </div>
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
