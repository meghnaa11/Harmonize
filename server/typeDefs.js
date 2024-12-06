export const typeDefs = `#graphql
    type Query {
        users: [User]
        reviews: [Review]
        getUserById(userId:String!): User!
        getReviewById(reviewId:String!): Review!
        getTrackById(trackId:String!): Track!
        searchTrackByName(searchTerm:String!): [Track]!
    }

    type Mutation {
        createUser(uuid:String!, username: String!, email:String!)
        createReview(title:String!, content:String!, userId:String!, trackId:String!)
    }

    type User {
        _id: String!
        username: String!
        email: String!
        reviews: [Review]!
    }

    type Review {
        _id: String!,
        user: User!
        title: String!
        content: String!
        track: Track!
    }
    
    type Track {
        _id: String!,
        title: String!
        artist: String!
        length: Int!
        genre: String!
        album: String
    }    
`;
