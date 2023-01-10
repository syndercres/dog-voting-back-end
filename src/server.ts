import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { Client } from "pg";
import { getEnvVarOrFail } from "./support/envVarUtils";
import { setupDBClientConfig } from "./support/setupDBClientConfig";

dotenv.config(); //Read .env file lines as though they were env vars.

const dbClientConfig = setupDBClientConfig();
const client = new Client(dbClientConfig);

//Configure express routes
const app = express();

app.use(express.json()); //add JSON body parser to each following route handler
app.use(cors()); //add CORS support to each following route handler
//-----------------------------------------------------------------------------------------------Requests from front end
app.get("/", async (req, res) => {
  res.json({ msg: "Hello! There's nothing interesting for GET /" });
});

app.get("/health-check", async (req, res) => {
  try {
    //For this to be successful, must connect to db
    await client.query("select now()");
    res.status(200).send("system ok");
  } catch (error) {
    //Recover from error rather than letting system halt
    console.error(error);
    res.status(500).send("An error occurred. Check server logs.");
  }
});
//-----------------------------------------------------------------------------------------------get request for all data from votes table
app.get("/votes", async (req, res) => {
  const breedsList = await client.query(
    "SELECT * FROM votes ORDER BY likes DESC LIMIT 10"
  );
  res.status(200).json(breedsList);
});

//-----------------------------------------------------------------------------------------------post breed/vote to votes table
app.post("/votes", async (req, res) => {
  const breedName = req.body.breed;

  const text = `INSERT INTO votes(breed, likes)
  VALUES($1,$2) 
  ON CONFLICT (breed)
  DO UPDATE SET likes = votes.likes + 1
  RETURNING *
`;

  const values = [breedName, 1];

  const postData = await client.query(text, values);

  res.status(201).json(postData);
});

//-----------------------------------------------------------------------------------------------connect to database
connectToDBAndStartListening();

async function connectToDBAndStartListening() {
  console.log("Attempting to connect to db");
  await client.connect();
  console.log("Connected to db!");

  const port = getEnvVarOrFail("PORT");
  app.listen(port, () => {
    console.log(
      `Server started listening for HTTP requests on port ${port}.  Let's go!`
    );
  });
}
