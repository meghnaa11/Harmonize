import { MongoClient } from "mongodb";
const mongoConfig = {
  serverUrl: "mongodb://localhost:27017/",
  database: "harmonize",
};

let _connection = undefined;
let _db = undefined;
export const dbConnection = async () => {
  if (!_connection) {
    _connection = await MongoClient.connect(mongoConfig.serverUrl);
    _db = _connection.db(mongoConfig.database);
  }
  return _db;
};
export const closeConnection = async () => {
  await _connection.close();
};

const getCollectionFn = (collection) => {
  let _col = undefined;

  return async () => {
    if (!_col) {
      const db = await dbConnection();
      _col = await db.collection(collection);
    }

    return _col;
  };
};

export const authors = getCollectionFn("users");
export const books = getCollectionFn("reviews");
