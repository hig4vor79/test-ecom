import "dotenv/config";
import express from "express";

import connectDatabase from "./db.js";
import { ProductRoute } from "./routes/index.js";

const app = express();
app.use(express.json());

connectDatabase();

app.use("/api", ProductRoute.router);

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
