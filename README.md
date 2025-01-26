Deploy an app (e.g., MongoDB with a backend) using Docker Networking and Volumes.

We set up a MongoDB container with a persistent data volume to ensure that database data is retained across container restarts.
We created a Node.js backend application that connects to MongoDB using a custom Docker network (app_network).
We used Docker's -v flag to mount a volume for MongoDB data and set up a Docker network for communication between the containers.
Finally, we also provided an optional Docker Compose file to simplify the multi-container setup.

Steps to Deploy MongoDB with a Backend Using Docker Networking and Volumes
Step 1: Create a Docker Network
First, create a custom Docker network to allow communication between the backend container (Node.js) and the MongoDB container.

bash
Copy
Edit
docker network create app_network
Step 2: Create a Volume for MongoDB Data
Create a volume to persist MongoDB data so that it isn't lost if the container is removed or restarted.

bash
Copy
Edit
docker volume create mongo_data
Step 3: Set Up the MongoDB Container
Now, run the MongoDB container, attaching it to the app_network and mounting the mongo_data volume.

bash
Copy
Edit
docker run -d \
  --name mongodb \
  --network app_network \
  -v mongo_data:/data/db \
  -e MONGO_INITDB_ROOT_USERNAME=root \
  -e MONGO_INITDB_ROOT_PASSWORD=rootpassword \
  mongo:latest
--name mongodb: Name the MongoDB container mongodb.
--network app_network: Connect the container to the app_network network created earlier.
-v mongo_data:/data/db: Mount the mongo_data volume to the /data/db directory inside the container to persist MongoDB data.
-e MONGO_INITDB_ROOT_USERNAME=root and -e MONGO_INITDB_ROOT_PASSWORD=rootpassword: Set up root credentials for MongoDB.
Step 4: Create the Backend (Node.js) Application
Let’s create a simple Node.js application that connects to MongoDB.

Create a Directory for Your Backend App:

Create a directory to hold your Node.js backend code.

bash
Copy
Edit
mkdir node-backend
cd node-backend
Initialize a Node.js Application:

Initialize a new Node.js project.

bash
Copy
Edit
npm init -y
Install Dependencies:

Install the necessary dependencies, such as express for the server and mongoose for MongoDB interaction.

bash
Copy
Edit
npm install express mongoose
Create an index.js File:

Create a file named index.js for the backend application.

javascript
Copy
Edit
const express = require("express");
const mongoose = require("mongoose");

const app = express();
const port = 3000;

// MongoDB connection
mongoose.connect("mongodb://root:rootpassword@mongodb:27017", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Error connecting to MongoDB:", err));

// A simple route
app.get("/", (req, res) => {
  res.send("Hello from the Node.js backend!");
});

app.listen(port, () => {
  console.log(`Backend app running on http://localhost:${port}`);
});
Create a Dockerfile for the Node.js App:

Create a Dockerfile for the Node.js backend to containerize it.

Dockerfile
Copy
Edit
# Use Node.js official image
FROM node:16

# Set the working directory inside the container
WORKDIR /app

# Copy the package.json and package-lock.json
COPY package*.json ./

# Install the dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the port the app will run on
EXPOSE 3000

# Start the application
CMD ["node", "index.js"]
Build the Node.js Image:

Build the Docker image for the Node.js application.

bash
Copy
Edit
docker build -t node-backend .
Step 5: Run the Node.js Backend Container
Now, run the Node.js backend container and connect it to the app_network.

bash
Copy
Edit
docker run -d \
  --name node-backend \
  --network app_network \
  -p 3000:3000 \
  node-backend
--network app_network: Connect the Node.js container to the app_network network, allowing it to communicate with MongoDB.
-p 3000:3000: Expose port 3000 on the host machine to the container, making the Node.js app accessible at http://localhost:3000.
Step 6: Verify the Setup
Check MongoDB Logs: Verify that MongoDB is running properly by viewing its logs.

bash
Copy
Edit
docker logs mongodb
Check Node.js Backend Logs: Verify that the Node.js backend is running and connected to MongoDB.

bash
Copy
Edit
docker logs node-backend
Test the Application: Open your browser or use curl to access the backend API.

bash
Copy
Edit
curl http://localhost:3000
