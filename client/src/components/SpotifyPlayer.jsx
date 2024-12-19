import React, { useEffect, useRef } from 'react';

function SpotifyPlayer({ songUrl, play, onPlay }) {
    const embedUrl = songUrl.replace(/open.spotify.com/, "open.spotify.com/embed");
    const playerRef = useRef(null);

    return (
        <iframe 
            src={embedUrl}  key={play ? songUrl : `paused-${songUrl}`}   width="300"  height="380" frameBorder="0"  allowTransparency="true" 
            allow="encrypted-media"
            onLoad={onPlay}
        ></iframe>
    );
}

export default SpotifyPlayer;
