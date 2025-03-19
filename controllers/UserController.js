import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

import { UserModel } from "../models";

const registration = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const existingUser = await UserModel.findOne({ email });

    if (existingUser) {
      res.status(404).json({
        message: "This email has already been used",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    // const doc = new ProductModel({
    //   title,
    //   quantity,
    //   price,
    // });

    // const product = await doc.save();

    // res.status(201).json(product);
  } catch (error) {
    console.log("Create user error: " + error);
    res.status(500).json({
      message: "Create user error",
      error,
    });
  }
};
