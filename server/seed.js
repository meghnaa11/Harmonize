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
    userId: "NirGBrQnieZ700hxGhJx56jjYpS2",
    title: "Good song",
    content: "Just a good song.",
    trackId: "32ca187e-ee25-4f18-b7d0-3b6713f24635",
  },
  {
    _id: uuid(),
    userId: "OJYebtjw9DcTzC8MV0AqzvZhHN42",
    title: "Good song",
    trackId: "32ca187e-ee25-4f18-b7d0-3b6713f24635",
    content: "Just a good song.",
  },
  {
    _id: uuid(),
    userId: "dZsjkuztpZTtUeNJo7hHd0CrLPf1",
    trackId: "32ca187e-ee25-4f18-b7d0-3b6713f24635",
    title: "Good song",
    content: "Just a good song.",
  },
]);

await closeConnection();
