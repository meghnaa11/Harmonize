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
    node: 'https://localhost:9200',
    auth: {
      username: 'elastic',
      password: process.env.ELASTIC_SEARCH_PASSWORD
    },
    tls: {
      ca: readFileSync(fullPath),
      rejectUnauthorized: false
    }
});

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
          document: song
        });
        console.log(`Indexed song: ${song.name}`, response.result)
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
            fields: ['name', 'artist', 'album', 'genre'],
          },
        },
      })
  
      if (response.hits.total.value > 0) {
        let searchResult = {result: response.hits.total.value, data: []}
        response.hits.hits.forEach((hit, index) => {
            searchResult.data.push({
                name: hit._source.name,
                artist: hit._source.artist,
                album: hit._source.album,
                year_released: hit._source.year_released,
                duration: hit._source.duration,
                genre: hit._source.genre
            })
        })
        return searchResult
      } else {
        console.log('No songs found matching your search term.');
      }
    } catch (error) {
      console.error('Error searching for songs:', error);
    }
  };

//   console.log(resolve("search/seed.json"))

  const songs = JSON.parse(fs.readFileSync('search/seed.json', 'utf-8'));


//   await indexSongs(songs)

const result =  await searchSongs('rolling')
console.log(result)

