// For reviews, we have to decide what kind of things users can review (artist, album, and/or track)

export const typeDefs = `#graphql
    type User {
        _id: String!
        username: String!
        email: String!
        password: String!
        following: [User]!
        followers: [User]!
        musicPreferences: [String]!
        spotify: String
        appleMusic: String
        preferredAccount: String
        groupChats: [GroupChat]!
    }

    type Review {
        _id: String!,
        user: User!
        title: String!
        content: String!
        album: Album
        track: Track
        artist: Artist
        comments: [Comment]!
    }
    
    type Comment {
        _id: String!,
        review: Review!
        user: User!
        content: String!
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
        
    type Album {
        _id: String!,
        title: String!
        artist: Artist!
        tracklist: [Track!]!
        releaseDate: String!
        genre: String!
    }
    
    type Track {
        _id: String!,
        title: String!
        artist: Artist!
        length: Int!
        genre: String!
        album: Album
    }
    
    type Artist {
        _id: String!,
        name: String!
        albums: [Album]!
        tracks: [Track]!
    }

    

`;
