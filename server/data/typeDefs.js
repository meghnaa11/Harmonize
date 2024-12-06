// For reviews, we have to decide what kind of things users can review (artist, album, and/or track)

export const typeDefs = `#graphql
    type Query {
        users: [User]
        reviews: [Review]
        getGroupChatsByMembers()
        searchTrackByName(searchTerm:String!): [Track]!
    }

    type Mutation {
        
    }

    type User {
        _id: String!
        username: String!
        email: String!
        reviews: [Review]!
        following: [User]!
        followers: [User]!
        groupChats: [GroupChat]!
    }

    type Review {
        _id: String!,
        user: User!
        title: String!
        content: String!
        track: Track
    }
    
    type Message {
        _id: String!,
        sender: User!,
        groupChat: GroupChat!
        content: String!
        timestamp: String!
    }
    
    type GroupChat {
        _id: String!
        name: String!
        members: [User!]!
        messages: [Message]!
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
