const express = require("express");
const mongoose = require("mongoose");

const app = express();
const port = 3000;

// MongoDB connection
mongoose
  .connect("mongodb://root:rootpassword@mongodb:27017/testdb", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Error connecting to MongoDB:", err));

// Basic route
app.get("/", (req, res) => {
  res.send("Hello simran, you can do it! from the Node.js backend!");
});

app.listen(port, () => {
  console.log(`Backend app is running on http://localhost:${port}`);
});
