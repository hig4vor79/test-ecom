import jwt from "jsonwebtoken";

const isAuthenticatedUser = (req, res, next) => {
  const token = (req.headers.authorization || "").replace(/Bearer\s?/, "");

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.userId = decoded._id;
      next();
    } catch (e) {
      return res.status(403).json({
        message: "No access (not authorized)",
      });
    }
  } else {
    return res.status(403).json({
      message: "No access (not authorized)",
    });
  }
};
export default isAuthenticatedUser;
