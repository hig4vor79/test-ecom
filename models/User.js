import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    email: {
      //uniq key
      type: String,
      required: [true, "Email is require"],
      unique: true,
    },
    passwordHash: {
      type: String,
      required: [true, "Password is require"],
    },
    isAdmin: {
      type: Boolean,
      required: true,
      default: false,
    },
    resetPasswordToken: String,
  },
  {
    timestamps: true,
    collection: "users",
  }
);

const UserModel = mongoose.model("User", UserSchema);

export { UserModel };
