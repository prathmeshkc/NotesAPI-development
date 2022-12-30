const express = require("express");
const app = express();
const noteRouter = require("./routes/noteRoutes");
const userRouter = require("./routes/userRoutes");
const dotenv = require("dotenv"); /*for automatically loading environment variables from .env file*/
const cors = require("cors"); /* cors is a middleware. it will add some headers in each response and our API can be called from everywhere*/
const cloudinary = require('cloudinary').v2

dotenv.config(); /*Loads .env file contents into process.env*/

cloudinary.config({
  cloud_name:"dcqa6vckq",
  api_key:"968496778275963",
  api_secret:"IS1ns46iUHrfW2QQ7QC70t1WM-k"
})

const mongoose = require("mongoose");// mongoose is an ODM(Object Data Model) which helps us to avoid writing all the validation checks
// const auth = require("./middlewares/auth");
const { urlencoded } = require("express");

app.use(express.json());// called because express cannot handle a json file directly
app.use(urlencoded({extended: true}))
app.use(cors());

app.use("/users", userRouter);
app.use("/notes", noteRouter);

app.get("/", (req, res) => {
  res.send("Notes API");
});

// const PORT = process.env.PORT || 5000;
const PORT = 5000;

mongoose
  .connect("mongodb+srv://retr0:425001@development-cluster.44vle21.mongodb.net/?retryWrites=true&w=majority")
  .then(() => {
    console.log("Connected to Database");
    app.listen(PORT, () => {
      console.log(`Server up and running at PORT ${PORT}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
