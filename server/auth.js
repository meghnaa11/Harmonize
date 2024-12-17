import axios from "axios";
import qs from "qs";
import fs from "fs";
import dotenv from "dotenv";

dotenv.config();

async function getSpotifyAccessToken() {
  let tokenInfo;

  try {
    tokenInfo = JSON.parse(fs.readFileSync("./tokenInfo.json", "utf-8"));
  } catch (err) {
    console.log(err);
    tokenInfo = null;
  }
  if (tokenInfo && Date.now() - tokenInfo.timestamp < 60 * 60 * 1000) {
    return tokenInfo.token;
  }

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
    const newTokenInfo = {
      timestamp: Date.now(),
      token: response.data.access_token,
    };
    fs.writeFileSync(
      "./tokenInfo.json",
      JSON.stringify(newTokenInfo, null, 2),
      "utf-8"
    );

    return response.data.access_token;
  } catch (error) {
    throw new Error("Failed to get Spotify access token");
  }
}

export default getSpotifyAccessToken;
