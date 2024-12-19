import React, {useState} from "react";
import "../App.css";
import { useQuery } from "@apollo/client";
import queries from "../queries";
import { NavLink } from "react-router-dom";
import SpotifyPlayer from "./SpotifyPlayer";

function App() {
  const { loading, error, data } = useQuery(queries.GET_REVIEWS);
  const [currentPlaying, setCurrentPlaying] = useState(null);

  const handlePlayToggle = (trackId) => {
    if (currentPlaying === trackId) {
      setCurrentPlaying(null)
    } else {
      setCurrentPlaying(trackId)
    }
  };

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
                    "{review.title}"
                  </NavLink>
                  -{" "}
                  <NavLink to={`/user/${review.user._id}`} className="link">
                    {review.user.username}
                  </NavLink>
                </h2>
                <h3>
                  A review of{" "}
                  <NavLink to={`/track/${review.track._id}`} className="link">
                    "{review.track.title}"
                  </NavLink>{" "}
                  by {review.track.artist}
                </h3>
                {/* {console.log(review.track.songUrl)} */}
                <a href={review.track.songUrl} className="link" target="_blank">
                  <br />
                  Listen to the full song!
                </a>
              </div>
              {/* <img src={review.track.imageUrl} className="art" /> */}

              <SpotifyPlayer songUrl={review.track.songUrl} play={currentPlaying === review.track._id} onPlay={() => console.log('Track playing')}/>
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
