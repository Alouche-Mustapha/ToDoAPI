const jwt = require("jsonwebtoken");
const { UnauthenticatedError } = require("../errors");

const authenticationMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new UnauthenticatedError(
      "Authentication invalid , no token provided"
    );
  }

  const token = authHeader.split(" ")[1];

  try {
    const playload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = {
      userId: playload.userId,
      name: playload.name,
      isAdmin: playload.isAdmin,
    };
    next();
  } catch (error) {
    throw new UnauthenticatedError("Not authorized to access this route");
  }
};

module.exports = authenticationMiddleware;
