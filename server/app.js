import express from "express";

const app = express()

app.set("trust proxy", true);
app.use(express.json());

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`Harmonize running at http://localhost:${port}`)
});

