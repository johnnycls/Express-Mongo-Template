import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import User from "../models/user.model.js";
import auth from "../middlewares/auth.js";
import { JWT_SECRET } from "../config.js";

const router = express.Router();

router.post("/register", async (req, res) => {
  const { name, password } = req.body;

  try {
    // check if the user already exists
    let user = await User.findOne({ name });
    if (user) {
      return res.status(400).json({ msg: "Already Exists" });
    }

    // hash user password
    const salt = await bcrypt.genSalt(10);
    const pw = await bcrypt.hash(password, salt);
    user = new User({ name, password: pw });
    await user.save();

    // return jwt
    const payload = {
      name: user.name,
    };

    jwt.sign(payload, JWT_SECRET, {}, (err, token) => {
      if (err) console.log(err.message);
      res.json({ token, ...payload });
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

router.post("/login", async (req, res) => {
  const { name, password } = req.body;

  try {
    // check if the user exists
    let user = await User.findOne({ name });
    if (!user) {
      return res.status(400).json({ msg: `user ${name} doesn't exist` });
    }

    // check is the encrypted password matches
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "username or password incorrect" });
    }

    // return jwt
    const payload = {
      name: user.name,
    };

    jwt.sign(payload, JWT_SECRET, {}, (err, token) => {
      if (err) console.log(err.message);
      res.json({ token, ...payload });
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

router.get("/", auth, async (req, res) => {
  try {
    const name = res.locals.user;
    const user = await User.findOne({ name });
    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json(error);
  }
});

export default router;
