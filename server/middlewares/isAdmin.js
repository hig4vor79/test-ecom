import jwt from "jsonwebtoken";
import { UserModel } from "../models/index.js";

const isAdmin = async (req, res, next) => {
  try {
    const token = (req.headers.authorization || "").replace(/Bearer\s?/, "");

    if (!token) {
      return res.status(403).json({ message: "No access (not authorized)" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded._id;

    const user = await UserModel.findById(req.userId);
    if (!user || !user.isAdmin) {
      return res.status(403).json({ message: "No access (not admin)" });
    }

    next();
  } catch (error) {
    return res.status(403).json({ message: "No access (not authorized)" });
  }
};

export default isAdmin;
