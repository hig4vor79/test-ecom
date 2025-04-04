import "dotenv/config";
import express from "express";

import connectDatabase from "./db.js";
import {
  OrderRoute,
  ProductRoute,
  UserRoute,
  PostRoute,
} from "./routes/index.js";

const app = express();
app.use(express.json());

connectDatabase();

const storage = multer.diskStorage({
  destination: (_, __, cb) => {
    if (!fs.existsSync("uploads")) {
      fs.mkdirSync("uploads");
    }
    cb(null, "uploads");
  },
  filename: (_, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

app.use("/uploads", express.static("uploads"));

app.post("/api/upload", checkAuth, upload.single("image"), (req, res) => {
  res.json({
    url: `/uploads/${req.file.originalname}`,
  });
});

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
