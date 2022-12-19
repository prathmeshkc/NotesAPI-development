const noteModel = require("../models/note");
const cloudinary = require("cloudinary").v2;

const createNote = async (req, res) => {
  const { title, description } = req.body;
  let cloudinaryResult;
  let img_urls = [];
  console.log("Req.body", req.body);
  console.log("userId", req.userId);
  console.log("Req.files:", req.files);

  if (req.files) {
    try {
      console.log("Note Image provided", req.files.length);

      for (let index = 0; index < req.files.length; index++) {
        cloudinaryResult = await cloudinary.uploader.upload(
          req.files[index].path,
          {
            folder: "NotesAPi-development",
          }
        );

        img_urls.push({
          secure_url: cloudinaryResult.secure_url,
          public_id: cloudinaryResult.public_id,
        });
      }

      const result = new noteModel({
        title: title,
        description: description,
        img_urls: img_urls,
        userId: req.userId,
      });

      try {
        await result.save();
        res.status(201).json(result);
      } catch (error) {
        console.log("Error saving note- img provided block", error);
        res.status(500).json({ message: "Something went wrong!" });
      }
    } catch (error) {
      console.log("Cloudinary upload error: ", error);
      return res.send(error);
    }
  }
};

const updateNote = async (req, res) => {
  const id = req.params.id;
  const { title, description } = req.body;

  let cloudinaryResult;
  let img_urls = [];
  console.log("userId", req.userId);
  console.log("noteId", id);
  console.log("Req.files:", req.files);

  if (req.files) {
    try {
      console.log("Note Image provided", req.files.length);

      for (let index = 0; index < req.files.length; index++) {
        cloudinaryResult = await cloudinary.uploader.upload(
          req.files[index].path,
          {
            folder: "NotesAPi-development",
          }
        );

        img_urls.push({
          secure_url: cloudinaryResult.secure_url,
          public_id: cloudinaryResult.public_id,
        });
      }

      const result = {
        title: title,
        description: description,
        img_urls: img_urls,
        userId: req.userId,
      };

      try {
        const oldNote = await noteModel.findById(id);
        console.log(oldNote);
        for (let index = 0; index < oldNote.img_urls.length; index++) {
          cloudinary.uploader
            .destroy(oldNote.img_urls[index].public_id)
            .then((result) => console.log(result));
        }
       

        await noteModel.findByIdAndUpdate(id, result, { new: true });
        res.status(200).json(result);
      } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Something went wrong!" });
      }
    } catch (error) {
      console.log("Cloudinary upload error: ", error);
      return res.send(error);
    }
  }
};

const deleteNote = async (req, res) => {
  const id = req.params.id;
  try {
    const note = await noteModel.findByIdAndRemove(id);
    // const note = await noteModel.findById(id);
    console.log(note);
    for (let index = 0; index < note.img_urls.length; index++) {
      cloudinary.uploader
        .destroy(note.img_urls[index].public_id)
        .then((result) => console.log(result));
    }
    res.status(202).json({
      message: "Note Deleted Successfully!",
      deleted_note: note,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong!" });
  }
};

const getNotes = async (req, res) => {
  try {
    const notes = await noteModel.find({ userId: req.userId });
    res.status(200).json(notes);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong!" });
  }
};

module.exports = {
  createNote,
  updateNote,
  deleteNote,
  getNotes,
};
