// Create web server
const express = require("express");
const app = express();
const port = 3000;
const { MongoClient } = require("mongodb");

// Connect to MongoDB
const uri = "mongodb://localhost:27017";
const client = new MongoClient(uri);

app.use(express.json());

// Create a new comment
app.post("/comments", async (req, res) => {
  try {
    await client.connect();
    const database = client.db("mydatabase");
    const collection = database.collection("comments");

    const comment = req.body;
    await collection.insertOne(comment);
    res.status(201).send(comment);
  } finally {
    await client.close();
  }
});

// Get all comments
app.get("/comments", async (req, res) => {
  try {
    await client.connect();
    const database = client.db("mydatabase");
    const collection = database.collection("comments");

    const comments = await collection.find({}).toArray();
    res.status(200).send(comments);
  } finally {
    await client.close();
  }
});

// Get a comment by ID
app.get("/comments/:id", async (req, res) => {
  try {
    await client.connect();
    const database = client.db("mydatabase");
    const collection = database.collection("comments");

    const commentId = req.params.id;
    const comment = await collection.findOne({ _id: new MongoClient.ObjectId(commentId) });

    if (!comment) {
      return res.status(404).send({ message: "Comment not found" });
    }

    res.status(200).send(comment);
  } finally {
    await client.close();
  }
});

// Update a comment by ID
app.put("/comments/:id", async (req, res) => {
  try {