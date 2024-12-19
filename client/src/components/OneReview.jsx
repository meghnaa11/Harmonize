import React from "react";
import { useContext } from "react";
import "../App.css";
import { useQuery, useMutation } from "@apollo/client";
import queries from "../queries";
import { NavLink, useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import * as v from "../validation";

function App() {
  const { id } = useParams();
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();
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

  const [deleteComment] = useMutation(queries.DELETE_COMMENT, {
    refetchQueries: [
      {
        query: queries.GET_REVIEW_BY_ID,
        variables: { reviewId: id },
      },
    ],
  });

  const [deleteReview] = useMutation(queries.DELETE_REVIEW, {
    update(cache, { data }) {
      try {
        const reviewId = id;
        const { reviews } = cache.readQuery({
          query: queries.GET_REVIEWS,
        });

        if (reviews) {
          cache.writeQuery({
            query: queries.GET_REVIEWS,
            data: {
              reviews: reviews.filter((review) => review._id !== reviewId),
            },
          });
        }
        const trackId = data.trackId;
        const { getTrackReviews } = cache.readQuery({
          query: queries.GET_TRACK_REVIEWS,
          variables: { trackId },
        });

        if (getTrackReviews) {
          cache.writeQuery({
            query: queries.GET_TRACK_REVIEWS,
            variables: { trackId },
            data: {
              getTrackReviews: getTrackReviews.filter(
                (review) => review._id !== reviewId
              ),
            },
          });
        }
      } catch (error) {
        console.error("Error updating cache:", error);
      }
    },
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
          {currentUser.uid === review.user._id && (
            <button
              onClick={async () => {
                await deleteReview({
                  variables: {
                    reviewId: review._id,
                  },
                });
                navigate("/reviews");
              }}
            >
              Delete
            </button>
          )}
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
          <h4>
            A review by{" "}
            <NavLink to={`/user/${review.user._id}`} className="link">
              {review.user.username}
            </NavLink>
          </h4>
          <p>Review Text: {review.content}</p>
        </div>
        <div className="reviewCard">
          <h4>Comments</h4>
          <form onSubmit={addComment} className="form-container">
            <input type="text" placeholder="Write a comment." id="comment" />
            <button type="submit" className="NavLink my-5">Post</button>
          </form>
          <ul className="commentList">
            {review.comments.map((comment) => (
              <li key={comment._id}>
                <h3>
                  <NavLink to={`/user/${comment.user._id}`} className="link">
                    {comment.user.username}
                  </NavLink>
                </h3>
                <p>{comment.text}</p>
                {currentUser.uid === comment.user._id && (
                  <button
                    onClick={async () => {
                      await deleteComment({
                        variables: {
                          commentId: comment._id,
                        },
                      });
                    }}
                  >
                    Delete
                  </button>
                )}
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
