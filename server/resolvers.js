import { GraphQLError } from "graphql";
import { users, reviews } from "./mongoConfig.js";
import axios from "axios";
import qs from "qs";
import getSpotifyAccessToken from "./auth.js";

export const resolvers = {
  // type Query {
  //     users: [User]!
  //     reviews: [Review]!
  //     getUserById(userId:String!): User!
  //     getReviewById(reviewId:String!): Review!
  //     getTrackById(trackId:String!): Track!
  //     searchTrackByName(searchTerm:String!): [Track]!
  // }
  Query: {
    users: async () => {
      let ucol = await users();
      let userList = await ucol.find({}).toArray();
      if (!userList) throw new GraphQLError("Failed getting all users.");
      return userList;
    },
    reviews: async () => {
      let rcol = await reviews();
      let reviewList = await rcol.find({}).toArray();
      if (!reviewList) throw new GraphQLError("Failed getting all reviews.");
      return reviewList;
    },
    getUserById: async (_, args) => {
      let ucol = await users();
      let user = await ucol.findOne({ _id: args.userId });
      if (!user)
        throw new GraphQLError(`Failed to find user with id:${args.userId}`);
      return user;
    },
    getReviewById: async (_, args) => {
      let rcol = await reviews();
      let review = await rcol.findOne({ _id: args.reviewId });
      if (!review)
        throw new GraphQLError(
          `Failed to find review with id:${args.reviewId}`
        );
      return review;
    },
    getTrackById: async (_, args) => {
      try {
        let spotifyKey = await getSpotifyAccessToken();
        const response = await axios.get(
          `https://api.spotify.com/v1/tracks/${args.trackId}`,
          {
            headers: {
              Authorization: `Bearer ${spotifyKey}`,
            },
          }
        );
        let trackData = response.data;
        let trackObj = {
          _id: trackData.id,
          title: trackData.name,
          artist: trackData.artists[0].name,
          album: trackData.album.name,
          imageUrl: trackData.album.images[0].url,
        };
        return trackObj;
      } catch (error) {
        throw new GraphQLError(`Failed to find track with id:${args.trackId}`);
      }
    },
    searchTracksByName: async (_, args) => {
      let spotifyKey = await getSpotifyAccessToken();
      try {
        const response = await axios.get(`https://api.spotify.com/v1/search`, {
          headers: {
            Authorization: `Bearer ${spotifyKey}`,
          },
          params: {
            q: args.searchTerm,
            type: "track",
          },
        });

        let tracksData = response.data.tracks.items;
        let tracksObj = tracksData.map((track) => ({
          _id: track.id,
          title: track.name,
          artist: track.artists[0].name,
          album: track.album.name,
          imageUrl: track.album.images[0].url,
        }));

        return tracksObj;
      } catch (error) {
        throw new GraphQLError(
          `Failed to search tracks with name:${args.searchTerm}`
        );
      }
    },
  },

  // type Mutation {
  //     createUser(uuid:String!, username: String!, email:String!): User!
  //     createReview(title:String!, content:String!, userId:String!, trackId:String!): Review!
  // }
  Mutation: {
    createUser: async (_, args) => {},
    createReview: async (_, args) => {},
  },

  //   type User {
  //     _id: String!
  //     username: String!
  //     email: String!
  //     reviews: [Review]!
  // }
  User: {
    reviews: async (parentValue) => {},
  },
  // type Review {
  //     _id: String!,
  //     user: User!
  //     title: String!
  //     content: String!
  //     track: Track!
  // }
  Review: {
    user: async (parentValue) => {},
    track: async (parentValue) => {},
  },
  // type Track {
  //     _id: String!,
  //     title: String!
  //     artist: String!
  //     album: String
  // }
};
