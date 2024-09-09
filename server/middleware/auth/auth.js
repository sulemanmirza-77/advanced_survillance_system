/* JSON Web Token */
const jwt = require("jsonwebtoken");

/* User authentication is done here
   After the user is authenticated, the user can perform "user" actions */
const getAccessToRoute = (req, res, next) => {
  /* The token is taken from the header */
  const access_token = req.headers.authorization.split(" ")[1];
  /* If the token doesn't exist */
  if (!access_token) {
    return res.status(401).json("You are not authenticated.");
  }
  /* JWT verify() Function */
  jwt.verify(access_token, process.env.JWT_SECRET_KEY, (err, dec) => {
    if (err) {
      return res.status(403).json("You are not authorized");
    }

    req.user = {
      id: dec.id,
      name: dec.name,
    };
    next();
  });
};

module.exports = { getAccessToRoute };
