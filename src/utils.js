import path from "path";
import { fileURLToPath } from "url";
import { config } from "./config/config.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import multer from "multer";
import { fstat } from "fs";

export const __dirname = path.dirname(fileURLToPath(import.meta.url));

//generate hash
export const createHash = (password) => {
  return bcrypt.hashSync(password, bcrypt.genSaltSync());
};
//compare passwords
export const isValidPassword = (password, user) => {
  return bcrypt.compareSync(password, user.password);
};

//generate token
export const generateToken = (user) => {
  const token = jwt.sign(
    {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      _id: user._id,
      lastConnection: user.lastConnection,
      avatar: user.avatar,
      cart: user.cart,
    },
    config.token.privateKey,
    {
      expiresIn: "24h",
    }
  );
  return token;
};

//multer
//validate required fields
const profileValidFields = (user) => {
  const { firstName, email, password } = user;
  if (!firstName || !email || !password) {
    return false;
  } else {
    return true;
  }
};
const profileMulterFilter = (req, file, cb) => {
  if (!profileValidFields(req.body)) {
    cb(null, false);
  } else {
    cb(null, true);
  }
};

//user images
const userStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "/multer/users/img"));
  },
  filename: (req, file, cb) => {
    cb(null, `${req.body.email}-profile-${file.originalname}`);
  },
});

const userUpload = multer({
  storage: userStorage,
  fileFilter: profileMulterFilter,
});

//user documents
const documentsStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "/multer/users/documents"));
  },

  filename: (req, file, cb) => {
    cb(null, `${req.user.email}-document-${file.originalname}`);
  },
});

const documentsUpload = multer({
  storage: documentsStorage,
});

//PRODUCTS
//validate required fields
const productValidFields = (product) => {
  const { title, description, price, code, stock, status, category } = product;
  if (
    !title ||
    !description ||
    !price ||
    !code ||
    !stock ||
    !status ||
    !category
  ) {
    return false;
  } else {
    return true;
  }
};

const productMulterFilter = (req, file, cb) => {
  if (!productValidFields(req.body)) {
    cb(null, false);
  } else {
    cb(null, true);
  }
};

//product images
const productsStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "/multer/products/img"));
  },
  filename: (req, file, cb) => {
    cb(null, `${req.body.code}-product-${file.originalname}`);
  },
});

const productsUpload = multer({
  storage: productsStorage,
  fileFilter: productMulterFilter,
});

export { userUpload, documentsUpload, productsUpload };
