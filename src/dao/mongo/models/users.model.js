import mongoose from "mongoose";

const usersCollection = "users";

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    require: true,
  },
  firstName: {
    required: true,
    type: String,
  },
  lastName: {
    required: true,
    type: String,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  age: Number,
  password: {
    type: String,
    required: true,
  },
  cart: {
    type: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "carts",
      },
    ],
  },
  role: {
    type: String,
    enum: ["user", "admin", "premium"],
  },
  documents: {
    type: [
      {
        name: { type: String, required: true },
        reference: { type: String, required: true },
      },
    ],
    default: [],
  },
  lastConnection: {
    type: Date,
    default: null,
  },
  status: {
    type: String,
    required: true,
    enum: ["incomplete", "pending", "complete"],
    default: "pending",
  },
  avatar: {
    type: String,
    default: "",
  },
});

export const usersModel = mongoose.model(usersCollection, userSchema);
