const express = require("express");
const app = express();
const noteRouter = require("./routes/noteRoutes");
const userRouter = require("./routes/userRoutes");
const dotenv = require("dotenv"); /*for automatically loading environment variables from .env file*/
const cors = require("cors"); /* cors is a middleware. it will add some headers in each response and our API can be called from everywhere*/

dotenv.config(); /*Loads .env file contents into process.env*/

const mongoose = require("mongoose");// mongoose is an ODM(Object Data Model) which helps us to avoid writing all the validation checks
const auth = require("./middlewares/auth");

app.use(express.json());// called because express cannot handle a json file directly
app.use(cors());

app.use("/users", userRouter);
app.use("/notes", noteRouter);

app.get("/", (req, res) => {
  res.send("Notes API");
});

const PORT = process.env.PORT || 5000;

mongoose
  .connect("mongodb+srv://Prathmesh94:425001@cluster0.s1out.mongodb.net/notes_db?retryWrites=true&w=majority")
  .then(() => {
    console.log("Connected to Database");
    app.listen(PORT, () => {
      console.log(`Server up and running at PORT ${PORT}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
