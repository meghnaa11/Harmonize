import React from "react";
import "../App.css";
import { useQuery } from "@apollo/client";
import queries from "../queries";
import { NavLink, useParams } from "react-router-dom";

function App() {
  const { id } = useParams();
  const {
    loading: albumLoading,
    error: albumError,
    data: albumData,
  } = useQuery(queries.GET_ALBUM_BY_ID, {
    variables: {
      albumId: id,
    },
  });

  let body = null;
  if (albumLoading) {
    body = <p>Loading...</p>;
  } else if (albumError) {
    body = <p>There was an error: {albumError.message}</p>;
  } else if (albumData) {
    let { getAlbumById: album } = albumData;
    // console.log(data);
    body = (
      <>
        {/* {JSON.stringify(reviews)} */}
        <div className="albumCard">
          <h2>"{album.title}"</h2>
          <h3>By: {album.artist}</h3>
          <img src={album.imageUrl} className="art" />
          <h3>Tracklist</h3>
          <ol className="trackList">
            {album.trackList.map((track) => (
              <li key={track._id}>
                <p>
                  <NavLink to={`/track/${track._id}`} className="link">
                    {track.title}
                  </NavLink>{" "}
                </p>
                <a href={track.songUrl} className="link" target="_blank">
                  (Listen)
                </a>
              </li>
            ))}
          </ol>
        </div>
      </>
    );
  }

  return (
    <>
      <h2 className="subtitle">Album</h2>
      {body}
    </>
  );
}

export default App;
