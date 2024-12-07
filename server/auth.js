import axios from "axios";
import qs from "qs";
import fs from "fs";
import dotenv from "dotenv";

dotenv.config();

async function getSpotifyAccessToken() {
  let tokenInfo;

  // Logic for checking if token is nonexistent or expired.
  try {
    tokenInfo = JSON.parse(fs.readFileSync("./server/tokenInfo.json", "utf-8"));
  } catch (err) {
    console.log("No existing token info, fetching new token");
    tokenInfo = null;
  }
  if (tokenInfo && Date.now() - tokenInfo.timestamp < 60 * 60 * 1000) {
    // console.log("Returning existing token");
    return tokenInfo.token;
  }

  //If there is no valid token, make a new one.
  const tokenUrl = "https://accounts.spotify.com/api/token";
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

  const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString(
    "base64"
  );

  const requestConfig = {
    method: "post",
    url: tokenUrl,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${credentials}`,
    },
    data: qs.stringify({
      grant_type: "client_credentials",
    }),
  };

  try {
    const response = await axios(requestConfig);
    //Stores new token in JSON file.
    const newTokenInfo = {
      timestamp: Date.now(),
      token: response.data.access_token,
    };
    fs.writeFileSync(
      "./server/tokenInfo.json",
      JSON.stringify(newTokenInfo, null, 2),
      "utf-8"
    );

    return response.data.access_token;
  } catch (error) {
    throw new Error("Failed to get Spotify access token");
  }
}

export default getSpotifyAccessToken;
