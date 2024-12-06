import { GraphQLError } from "graphql";
import { users, reviews } from "./mongoConfig";
import axios from "axios";

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
    users: async () => {},
    reviews: async () => {},
    getUserById: async () => {},
    getReviewById: async () => {},
    getTrackById: async () => {},
    searchTrackByName: async () => {},
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
  //     length: Int!
  //     genre: String!
  //     album: String
  // }
};
