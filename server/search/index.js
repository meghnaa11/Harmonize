import { Client } from "@elastic/elasticsearch"
import dotenv from "dotenv"
import { readFileSync } from "fs"
import { resolve } from 'path'
import fs from 'fs'


dotenv.config();
// console.log(process.env.ELASTIC_SEARCH_PASSWORD)

const fullPath = resolve('search/config/http_ca.crt')
// console.log('Full Path:', fullPath)


const client = new Client({
    node: 'http://es01:9200',
    auth: {
      username: 'elastic',
      // password: process.env.ELASTIC_SEARCH_PASSWORD
      password: "changeme"
    },
    // tls: {
    //   ca: readFileSync(fullPath),
    //   rejectUnauthorized: false
    // }
});

// console.log(await client.info())
// async function checkConnection() {
//   try {
//     const response = await client.info();
//     console.log('Elasticsearch info:', response);
//   } catch (error) {
//     console.error('Elasticsearch connection error:', error);
//   }
// }

// checkConnection();

//  (async () => {
//     try {
//       const info = await client.info();
//       console.log('Connected to Elasticsearch:', info);
//     } catch (error) {
//       console.error('Elasticsearch connection error:', error);
//     }
// })();

const indexSongs = async (songs) => {
    try {
      for (const song of songs) {
        const response = await client.index({
          index: 'songs', 
          id: song._id,  
          document: {
              title: song.title,
              artist: song.artist,
              imageUrl: song.imageUrl,
              songUrl: song.songUrl
          }
        });
        console.log(`Indexed song: ${song.title}`, response.result)
      }
        
      await client.indices.refresh({ index: 'songs' })
  
      console.log('All songs indexed successfully!')
      return true
    } catch (error) {
      console.error('Error indexing songs:', error)
    }
  };

  const searchSongs = async (searchTerm) => {
    try {
        const response = await client.search({
          index: 'songs', 
          query: {
            multi_match: {
              query: searchTerm,
              fields: ['title', 'artist'],
            },
          },
        })

        console.log(response)
    
        const hits = response.hits.hits;
        if (hits.length > 0) {
            const searchResults = hits.map(hit => ({
                _id: hit._id,
                title: hit._source.title,
                artist: hit._source.artist,
                imageUrl: hit._source.imageUrl,
                songUrl: hit._source.songUrl
            }));
        return searchResults
      } else {
        console.log('No songs found matching your search term.');
        return []
      }
    } catch (error) {
      console.error('Error searching for songs:', error);
    }
  };

//   console.log(resolve("search/seed.json"))

  // const songs = JSON.parse(fs.readFileSync('search/seed.json', 'utf-8'));


//   await indexSongs(songs)

// const result =  await searchSongs('rolling')
// console.log(result)

export {indexSongs, searchSongs}