import mongoose from "mongoose";

const MONGO_URI = process.env.MONGO_URI;

const connectDatabase = () => {
  mongoose
    .connect(MONGO_URI)
    .then(() => console.log("DB ok: ", MONGO_URI))
    .catch((err) => console.log("DB error", err));
};

export default connectDatabase;
