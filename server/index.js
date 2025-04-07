import "dotenv/config";
import express from "express";
import path from "path";

import connectDatabase from "./db.js";
import {
  OrderRoute,
  ProductRoute,
  UserRoute,
  PostRoute,
} from "./routes/index.js";

const app = express();
app.use(express.json());

app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

connectDatabase();

app.use("/api", ProductRoute.router);
app.use("/api", UserRoute.router);
app.use("/api", OrderRoute.router);
app.use("/api", PostRoute.router);

app.get("*", (req, res) => {
  res.json("test");
});

app.listen(process.env.PORT, process.env.HOST, (error) => {
  if (error) {
    return console.log(error);
  }

  console.log(
    `Server is running: http://` + process.env.HOST + ":" + process.env.PORT
  );
});
