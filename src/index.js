const express = require("express");
const app = express();
const noteRouter = require("./routes/noteRoutes");
const userRouter = require("./routes/userRoutes");
const dotenv = require("dotenv"); /*for automatically loading environment variables from .env file*/
const cors = require("cors"); /* cors is a middleware. it will add some headers in each response and our API can be called from everywhere*/
const cloudinary = require("cloudinary").v2;

dotenv.config(); /*Loads .env file contents into process.env*/

cloudinary.config({
  cloud_name: process.env.cloud_name,
  api_key: process.env.api_key,
  api_secret: process.env.api_secret,
});

const mongoose = require("mongoose"); // mongoose is an ODM(Object Data Model) which helps us to avoid writing all the validation checks
// const auth = require("./middlewares/auth");
const { urlencoded } = require("express");

app.use(express.json()); // called because express cannot handle a json file directly
app.use(urlencoded({ extended: true }));
app.use(cors());

app.use("/users", userRouter);
app.use("/notes", noteRouter);

app.get("/", (req, res) => {
  res.send("Notes API");
  console.log(process.env.MONGODB_URL);
  console.log(process.env.SECRET_KEY);
  console.log(process.env.api_key);
  console.log(process.env.api_secret);
  console.log(process.env.cloud_name);
});

// const PORT = process.env.PORT || 5000;
const PORT = 5000;

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URL);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

/* 
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
 */

//Connect to the database before listening
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server up and running at PORT ${PORT}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
