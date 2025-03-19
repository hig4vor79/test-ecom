import "dotenv/config";
import express from "express";

import connectDatabase from "./db.js";
import { ProductController } from "./controllers/index.js";

const app = express();
app.use(express.json());

connectDatabase();

app.post("/api/products", ProductController.create);

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
