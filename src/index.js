const express = require("express");
const app = express();
const noteRouter = require("./routes/noteRoutes");
const userRouter = require("./routes/userRoutes");
const dotenv = require("dotenv");
const cors = require("cors")

dotenv.config();

const mongoose = require("mongoose");
const auth = require("./middlewares/auth");

app.use(express.json());
app.use(cors())

app.use("/users", userRouter);
app.use("/notes", noteRouter);

app.get("/", (req, res) => {
  res.send("Notes API");
});

const PORT = process.env.PORT || 5000

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("Connected to Database");
    app.listen(PORT, () => {
      console.log(`Server up and running at PORT ${PORT}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
