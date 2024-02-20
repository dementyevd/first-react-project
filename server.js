const express = require("express");
const cors = require("cors");
const { MongoClient, ObjectId } = require("mongodb");

const app = express();
const mongo_uri = "mongodb://127.0.0.1:27017";
const db_name = "todoListDb";
const collection_name = "todos";
let db; //база данных

app.use(express.json());
app.use(cors());

//подключение к монго
MongoClient.connect(mongo_uri)
  .then((client) => {
    console.log("Connected to MongoDB");
    db = client.db(db_name);
  })
  .catch((error) => console.error("Error connecting to MongoDB", error));

//получение списка задач
app.get("/api/todos", async (req, res) => {
  try {
    const todos = await db.collection(collection_name).find().toArray();
    res.json(todos);
  } catch (error) {
    console.error("Error fetchng todos: ", error);
    res.status(500).json({ message: "Error fetching todos" });
  }
});

//добавление задач
app.post("/api/todos", async (req, res) => {
  try {
    const { todo, description, priority, deadline } = req.body;
    await db
      .collection(collection_name)
      .insertOne({ todo, description, priority, deadline });
    res.json({ message: "Todo added successfully" });
  } catch (error) {
    console.error("Error adding todos: ", error);
    res.status(500).json({ message: "Error adding todos" });
  }
});

//удаление
app.delete("/api/todos/:id", async (req, res) => {
  try {
    const id = new ObjectId(req.params.id);
    await db.collection(collection_name).deleteOne({ _id: id });
    res.json({ message: "Todos deleted successfully" });
  } catch (error) {
    console.error("Error deleting todos: ", error);
    res.status(500).json({ message: "Error deleting todos" });
  }
});

app.listen(8888, () => {
  console.log("Server is running on http://localhost:8888");
});
