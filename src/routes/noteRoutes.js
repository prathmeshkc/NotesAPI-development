const express = require("express");
const {
  getNotes,
  createNote,
  updateNote,
  deleteNote,
} = require("../controllers/noteController");

const auth = require("../middlewares/auth");
const multer = require("multer");

const noteRouter = express.Router();

const storage = multer.diskStorage({});

let upload = multer({
  storage
}).array("img_urls")


noteRouter.get("/", auth, getNotes);

noteRouter.post("/", auth,upload, createNote);

noteRouter.put("/:id", auth,upload, updateNote);

noteRouter.delete("/:id", auth, deleteNote);

module.exports = noteRouter;
