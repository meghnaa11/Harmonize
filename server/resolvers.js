import { GraphQLError } from "graphql";
import { users, reviews } from "./mongoConfig.js";
import axios from "axios";
import getSpotifyAccessToken from "./auth.js";
import * as v from "./validation.js";
import { v4 as uuid } from "uuid";
import { indexSongs, searchSongs, indexAlbums, searchAlbums } from "./search/index.js";

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
    getTrackReviews: async (_, args) => {
      let rcol = await reviews();
      let reviewList = await rcol.find({ trackId: args.trackId }).toArray();
      if (!reviewList)
        throw new GraphQLError(
          `Failed to find review with id:${args.reviewId}`
        );
      return reviewList;
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
          imageUrl: trackData.album.images[0].url,
          songUrl: trackData.external_urls.spotify,
        };
        return trackObj;
      } catch (error) {
        throw new GraphQLError(
          `Failed to find track with id:${args.trackId}, msg=${error}`
        );
      }
    },
    searchTracksByName: async (_, args) => {
      let spotifyKey = await getSpotifyAccessToken();
      const searchTerm =  args.searchTerm
      try {
        const indexedSongs = await searchSongs(searchTerm)
        // console.log('Songs: ' + indexedSongs)
        if(indexedSongs && indexedSongs.length > 0){
          console.log('Sending from index')
          return indexedSongs
        }
        const response = await axios.get(`https://api.spotify.com/v1/search`, {
          headers: {
            Authorization: `Bearer ${spotifyKey}`,
          },
          params: {
            q: searchTerm,
            type: "track",
          },
        });

        let tracksData = response.data.tracks.items;
        let tracksObj = tracksData.map((track) => ({
          _id: track.id,
          title: track.name,
          artist: track.artists[0].name,
          imageUrl: track.album.images[0].url,
          songUrl: track.external_urls.spotify,
        }));

        // console.log(tracksObj)
        await indexSongs(tracksObj)
        console.log('Indexex')

        return tracksObj;
      } catch (error) {
        throw new GraphQLError(
          `Failed to search tracks with name:${args.searchTerm}`
        );
      }
    },
    getAlbumById: async (_, args) => {
      try {
        let spotifyKey = await getSpotifyAccessToken();
        const response = await axios.get(
          `https://api.spotify.com/v1/albums/${args.albumId}`,
          {
            headers: {
              Authorization: `Bearer ${spotifyKey}`,
            },
          }
        );
        let albumData = response.data;
        let albumObj = {
          _id: albumData.id,
          title: albumData.name,
          artist: albumData.artists[0].name,
          imageUrl: albumData.images[0].url,
          trackListUrl: albumData.tracks.href,
        };
        return albumObj;
      } catch (error) {
        throw new GraphQLError(
          `Failed to find album with id:${args.albumId}, msg=${error}`
        );
      }
    },
    searchAlbumsByName: async (_, args) => {
      let spotifyKey = await getSpotifyAccessToken();
      const searchTerm =  args.searchTerm
      try {
        const indextedAlbums = await searchAlbums(searchTerm)
        if(indextedAlbums && indextedAlbums.length > 0){
          return indextedAlbums
        }
        const response = await axios.get(`https://api.spotify.com/v1/search`, {
          headers: {
            Authorization: `Bearer ${spotifyKey}`,
          },
          params: {
            q: searchTerm,
            type: "album",
          },
        });

        let albumsData = response.data.albums.items;
        // console.log(JSON.stringify(albumsData));
        let albumsObj = albumsData.map((album) => ({
          _id: album.id,
          title: album.name,
          artist: album.artists[0].name,
          imageUrl: album.images[0].url,
        }));

        await indexAlbums(albumsObj)

        return albumsObj;
      } catch (error) {
        throw new GraphQLError(
          `Failed to search albums with name:${args.searchTerm}`
        );
      }
    },
  },

  // type Mutation {
  //     createUser(uuid:String!, username: String!, email:String!): User!
  //     createReview(title:String!, content:String!, userId:String!, trackId:String!): Review!
  // }
  Mutation: {
    createUser: async (_, args) => {
      // console.log("createUser called with args:", args);
      let ucol = await users();
      let userObj = {
        _id: args.uuid,
        email: args.email,
        username: args.username,
      };
      let inserted = await ucol.insertOne(userObj);
      if (!inserted) throw new GraphQLError("Failed to create user.");
      // console.log("User successfully inserted:", userObj);
      return userObj;
    },
    createReview: async (_, args) => {
      let rcol = await reviews();
      args.title = v.vTitle(args.title);
      args.content = v.vContent(args.content);

      //Make sure user exists.
      let ucol = await users();
      let user = await ucol.findOne({ _id: args.userId });
      if (!user)
        throw new GraphQLError(
          `Could not create review: Failed to find user with id:${args.userId}`
        );

      //Make sure track exists.
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
        if (!trackData)
          throw new GraphQLError(
            `Could not create review: Failed to find track with id:${args.trackId}`
          );
      } catch (error) {
        throw new GraphQLError(
          `Could not create review: Internal server error while looking for track with id:${args.trackId}`
        );
      }

      let existingReview = await rcol.findOne({
        userId: args.userId,
        trackId: args.trackId,
      });
      if (existingReview) {
        throw new GraphQLError("Already reviewed this track!");
      }

      let reviewObj = {
        _id: uuid(),
        title: args.title,
        content: args.content,
        userId: args.userId,
        trackId: args.trackId,
        comments: [],
      };

      let inserted = await rcol.insertOne(reviewObj);
      if (!inserted)
        throw new GraphQLError(
          "Could not create review: Internal server error."
        );
      return reviewObj;
    },
    deleteReview: async (_, args) => {
      let rcol = await reviews();
      let review = await rcol.findOneAndDelete({ _id: args.reviewId });
      if (!review) {
        throw new GraphQLError("Review not found");
      }
      return "Review deleted successfully.";
    },
    createComment: async (_, args) => {
      try {
        let commentObj = {
          _id: uuid(),
          userId: args.userId,
          text: args.text,
        };

        let rcol = await reviews();
        let review = await rcol.findOne({ _id: args.reviewId });

        if (!review) {
          throw new GraphQLError("Review not found");
        }
        for (let comment of review.comments) {
          if (args.userId === comment.userId) {
            throw new GraphQLError("Already Commented!");
          }
        }
        let reviewUpdate = await rcol.findOneAndUpdate(
          { _id: args.reviewId },
          { $push: { comments: commentObj } },
          { returnDocument: "after" }
        );

        if (!reviewUpdate) {
          throw new GraphQLError("Review not found");
        }
        return commentObj;
      } catch (e) {
        throw new GraphQLError(e.message);
      }
    },
    deleteComment: async (_, args) => {
      let rcol = await reviews();
      let review = await rcol.findOneAndUpdate(
        { "comments._id": args.commentId },
        { $pull: { comments: { _id: args.commentId } } },
        { returnDocument: "after" }
      );
      if (!review) {
        throw new GraphQLError("Review not found");
      }
      return "Comment deleted successfully.";
    },
  },

  //   type User {
  //     _id: String!
  //     username: String!
  //     email: String!
  //     reviews: [Review]!
  // }
  User: {
    reviews: async (parentValue) => {
      let rcol = await reviews();
      let userReviews = await rcol.find({ userId: parentValue._id }).toArray();
      if (!userReviews)
        throw new GraphQLError(
          `Failed to find reviews for user with id: ${parentValue._id}`
        );
      return userReviews;
    },
  },
  // type Review {
  //     _id: String!,
  //     user: User!
  //     title: String!
  //     content: String!
  //     track: Track!
  // }
  Review: {
    user: async (parentValue) => {
      let ucol = await users();
      let user = await ucol.findOne({ _id: parentValue.userId });
      if (!user)
        throw new GraphQLError(
          `Failed to find user for review with id: ${parentValue._id}`
        );
      return user;
    },
    track: async (parentValue) => {
      try {
        let spotifyKey = await getSpotifyAccessToken();
        const response = await axios.get(
          `https://api.spotify.com/v1/tracks/${parentValue.trackId}`,
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
          songUrl: trackData.external_urls.spotify,
        };
        return trackObj;
      } catch (error) {
        throw new GraphQLError(
          `Failed to find track for review with id:${parentValue._id}`
        );
      }
    },
  },
  Track: {
    album: async (parentValue) => {
      try {
        let spotifyKey = await getSpotifyAccessToken();
        const response = await axios.get(
          `https://api.spotify.com/v1/tracks/${parentValue._id}`,
          {
            headers: {
              Authorization: `Bearer ${spotifyKey}`,
            },
          }
        );
        let trackData = response.data;
        let albumObj = {
          _id: trackData.album.id,
          title: trackData.album.name,
          imageUrl: parentValue.imageUrl,
          artist: trackData.album.artists[0].name,
        };
        return albumObj;
      } catch (error) {
        throw new GraphQLError(
          `Failed to find album for track with id:${parentValue._id}`
        );
      }
    },
  },
  Album: {
    trackList: async (parentValue) => {
      let spotifyKey = await getSpotifyAccessToken();
      if (!parentValue.trackListUrl) {
        try {
          let spotifyKey = await getSpotifyAccessToken();
          const response = await axios.get(
            `https://api.spotify.com/v1/albums/${parentValue._id}`,
            {
              headers: {
                Authorization: `Bearer ${spotifyKey}`,
              },
            }
          );
          let albumData = response.data;
          parentValue.trackListUrl = albumData.tracks.href;
        } catch (error) {
          throw new GraphQLError(
            `Failed to find album with id:${args.albumId}, msg=${error}`
          );
        }
      }
      let response = await axios.get(parentValue.trackListUrl, {
        headers: {
          Authorization: `Bearer ${spotifyKey}`,
        },
      });
      let trackList = response.data.items;
      let tracksObj = trackList.map((track) => ({
        _id: track.id,
        title: track.name,
        artist: track.artists[0].name,
        album: parentValue.title,
        imageUrl: parentValue.imageUrl,
        songUrl: track.external_urls.spotify,
      }));

      return tracksObj;
    },
  },
  Comment: {
    user: async (parentValue) => {
      let ucol = await users();
      let user = await ucol.findOne({ _id: parentValue.userId });
      if (!user)
        throw new GraphQLError(
          `Failed to find user for review with id: ${parentValue._id}`
        );
      return user;
    },
  },
  // type Track {
  //     _id: String!,
  //     title: String!
  //     artist: String!
  //     album: String
  // }
};
