import admin from "firebase-admin";
import dotenv from "dotenv";
import { readFileSync } from "fs";
import {
  users,
  reviews,
  dbConnection,
  closeConnection,
} from "./mongoConfig.js";
dotenv.config();
import { v4 as uuid } from "uuid";

const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
const serviceAccount = JSON.parse(readFileSync(serviceAccountPath, "utf8"));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

async function getAllUsers() {
  try {
    const users = [];
    let result = await admin.auth().listUsers(); // List the first batch of users

    result.users.forEach((user) => {
      users.push({
        _id: user.uid,
        username: user.displayName || "No username",
        email: user.email,
      });
    });

    return users;
  } catch (error) {
    console.error("Error fetching users:", error);
  }
}

let userList = await getAllUsers();

let db = await dbConnection();
await db.dropDatabase();

let ucol = await users();
await ucol.insertMany(userList);

let rcol = await reviews();
await rcol.insertMany([
  {
    _id: uuid(),
    userId: userList[Math.floor(Math.random() * userList.length)]["_id"],
    title: "Best Interlude EVER!",
    content:
      "Gladiator (Interlude) is a one-minute masterpiece that manages to pack an entire stadium's worth of energy into the span of a coffee break. Waterparks has truly outdone themselves here, crafting a soundscape that feels like a cinematic montage of triumph, rebellion, and neon lights. The song's explosive synths and hauntingly dynamic vocals make it feel like the battle anthem of a cyberpunk colosseum. You can almost picture an arena of gladiators throwing down—not with swords, but with guitar riffs and LED flashes. It's brief, sure, but it leaves a lasting impact, like a firework that burns brighter because it doesn't last long. Easily one of the boldest tracks on the album, and dare I say, one of Waterparks' best interludes ever. Would I listen to it on repeat? Absolutely—60 seconds at a time.",
    trackId: "3i1wfysypleeiL8THwVshq",
    comments: [],
  },
  {
    _id: uuid(),
    userId: userList[Math.floor(Math.random() * userList.length)]["_id"],
    title: "My Summer Anthem",
    trackId: "0Z2gIlbvlpFSb5W3TyCVjd",
    comments: [],
    content:
      "T Love by Quarters of Change is an emotionally charged track that masterfully blends raw, heartfelt lyrics with dreamy instrumentation, creating an immersive listening experience that resonates deeply with anyone who's ever been in love or yearned for connection. The band's signature sound shines through with its rich guitar riffs and a vocal delivery that feels both intimate and powerful, drawing you in like a personal confession set to music. As the song unfolds, the dynamics shift and evolve, making each moment feel fresh and engaging, as if the music itself is telling a story of passion, vulnerability, and longing. It's one of those tracks that you'll want to revisit again and again, finding new layers of meaning with every listen—a true gem in Quarters of Change's discography.",
  },
  {
    _id: uuid(),
    userId: userList[Math.floor(Math.random() * userList.length)]["_id"],
    trackId: "4xdBrk0nFZaP54vvZj0yx7",
    title: "Popular for a reason",
    comments: [],
    content:
      "HOT TO GO! is a high-energy anthem that bursts out of the speakers with infectious confidence, blending driving rhythms, bold guitar riffs, and a chorus that demands to be shouted at full volume. The song’s unapologetic attitude and playful swagger make it impossible not to move along, creating a perfect backdrop for late-night adventures or carefree moments with friends. Every element, from the punchy drums to the electrifying vocals, comes together in a whirlwind of sound that feels as if it’s daring you to keep up with its relentless momentum. HOT TO GO! doesn’t just ask for your attention—it grabs it and keeps it, leaving you buzzing with adrenaline and ready to hit repeat for one more round of its irresistible, fiery charm.",
  },
]);

await closeConnection();
