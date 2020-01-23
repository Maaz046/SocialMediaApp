// If npm start is used, changes in the local files will not be reflected in the deployed app, instead we
// use npm run server because we want nodemon to run the server for us and nodemon automatically makes and reflect changes
const express = require("express");
const mongoose = require("mongoose");
//Init express

//Brining in the three files
const users = require("./routes/api/users");
const profile = require("./routes/api/profile");
const posts = require("./routes/api/posts");

const app = express();

//DB config from keys file
const db = require("./config/keys").mongoURI;

//Connect to MongoDB
mongoose
  .connect(db)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

//Create endpoints/route handlers
app.get("/", (req, res) => res.send("Hello!"));

//Use Routes. To go to a user we want the url home/api/users
app.use("/api/users", users);
app.use("/api/profile", profile);
app.use("/api/posts", posts);

//If we want to deploy on Hiroku it wouldn't be 5000
const port = process.nextTick.PORT || 5000;

//Listen to a port
app.listen(port, () => console.log(`erver running on port ${port}`));
