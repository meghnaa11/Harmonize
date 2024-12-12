import { gql } from "graphql-tag";

const GET_REVIEWS = gql`
  query Reviews {
    reviews {
      _id
      user {
        _id
        username
      }
      title
      track {
        _id
        title
        artist
        imageUrl
      }
    }
  }
`;

const GET_REVIEW_BY_ID = gql`
  query GetReviewById($reviewId: String!) {
    getReviewById(reviewId: $reviewId) {
      content
      title
      _id
      track {
        _id
        album
        artist
        imageUrl
        title
      }
      user {
        _id
        username
      }
    }
  }
`;

const GET_USERS = gql`
  query Users {
    users {
      _id
      username
      email
      reviews {
        _id
        title
        content
        track {
          _id
          title
          artist
          album
          imageUrl
        }
      }
    }
  }
`;

const GET_USER_BY_ID = gql`
  query GetUserById($userId: String!) {
    getUserById(userId: $userId) {
      _id
      username
      email
      reviews {
        _id
        title
        content
        track {
          _id
          title
          artist
          album
          imageUrl
        }
      }
    }
  }
`;

const SEARCH_TRACKS_BY_NAME = gql`
  query SearchTracksByName($searchTerm: String!) {
    searchTracksByName(searchTerm: $searchTerm) {
      _id
      title
      artist
      album
      imageUrl
    }
  }
`;

const GET_TRACK_BY_ID = gql`
  query GetTrackById($trackId: String!) {
    getTrackById(trackId: $trackId) {
      _id
      title
      artist
      album
      imageUrl
    }
  }
`;

const CREATE_REVIEW = gql`
  mutation Mutation(
    $title: String!
    $content: String!
    $userId: String!
    $trackId: String!
  ) {
    createReview(
      title: $title
      content: $content
      userId: $userId
      trackId: $trackId
    ) {
      _id
      user {
        _id
        email
        username
      }
      title
      content
      track {
        _id
        title
        artist
        album
        imageUrl
      }
    }
  }
`;

const CREATE_USER = gql`
  mutation CreateUser($uuid: String!, $username: String!, $email: String!) {
    createUser(uuid: $uuid, username: $username, email: $email) {
      _id
      email
      username
    }
  }
`;

const GET_TRACK_REVIEWS = gql`
  query GetTrackReviews($trackId: String!) {
    getTrackReviews(trackId: $trackId) {
      _id
      user {
        username
        _id
      }
      title
      content
      track {
        _id
        title
        artist
        album
        imageUrl
      }
    }
  }
`;

let exported = {
  GET_REVIEWS,
  GET_REVIEW_BY_ID,
  GET_USERS,
  GET_USER_BY_ID,
  SEARCH_TRACKS_BY_NAME,
  GET_TRACK_BY_ID,
  CREATE_REVIEW,
  CREATE_USER,
  GET_TRACK_REVIEWS,
};

export default exported;
