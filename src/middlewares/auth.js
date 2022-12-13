const jwt = require("jsonwebtoken");
const dotenv = require("dotenv"); /*for automatically loading environment variables from .env file*/

dotenv.config()


const SECRET_KEY ="Prathmesh@425001"

const auth = (req, res, next) => {
  try {
    let token = req.headers.authorization;
    if (token) {
      token = token.split(" ")[1];
      let user = jwt.verify(token, SECRET_KEY);
      req.userId = user.id;/* Add new parameter in header to indicate that this particular note belongs to this particular User*/
    } else {
      return res.status(401).json({ message: "Unauthoruzed User!" });
    }

    next();
  } catch (error) {
    res.status(401).json({ message: "Unauthoruzed User!" });
  }
};

module.exports = auth;
