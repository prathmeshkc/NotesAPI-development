const bcrypt = require("bcrypt"); /* to hash and verify passwords*/
const userModel = require("../models/user");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv"); /*for automatically loading environment variables from .env file*/

dotenv.config()

const SECRET_KEY = "Prathmesh@425001";

const register = async (req, res) => {
  //1. Check for Existing User
  //2. Hashed Password
  //3. User Creation
  //4. Token Generation

  const { username, email, password } = req.body;
  try {
    const existingUser = await userModel.findOne({ email: email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists!" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await userModel.create({
      email: email,
      password: hashedPassword,
      username: username,
    });

    const token = jwt.sign(
      { email: result.email, id: result._id },
      SECRET_KEY
    ); /* both the jwts are signed with the same payloads in register and login*/
    res.status(201).json({ user: result, token: token });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong!" });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const existingUser = await userModel.findOne({ email: email });
    if (!existingUser) {
      return res.status(404).json({ message: "User not found!" });
    }

    const matchPassword = await bcrypt.compare(password, existingUser.password);
    if (!matchPassword) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }

    const token = jwt.sign(
      { email: existingUser.email, id: existingUser._id },
      SECRET_KEY
    ); /* both the jwts are signed with the same payloads in register and login*/
    res.status(200).json({ user: existingUser, token: token });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong!" });
  }
};

module.exports = { register, login };
