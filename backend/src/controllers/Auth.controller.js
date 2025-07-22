import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

//new user register
export const Register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "All field are required" });
    }

    const checkuser = await User.findOne({ email });
    if (checkuser) {
      return res
        .status(400)
        .json({ success: false, message: "User already registered." });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = new User({
      name,
      email,
      password: hashedPassword,
    });

    await user.save();

    res.status(201).json({
      success: true,
      message: "Registration successful.",
    });
  } catch (error) {
    console.log("Error in user register controller ", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

// user login
export const Login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "All field are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid login credentials." });
    }

    const comparePassword = await bcrypt.compare(password, user.password);
    if (!comparePassword) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid login credentials." });
    }

    const token = jwt.sign(
      {
        _id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    res.cookie("jwt", token, {
      maxAge: 7 * 24 * 60 * 60 * 1000, //in millisecond
      httpOnly: true, // prevent xss attack cross site scripting attack
      sameSite: "strict", // CSRF attacks cross site request forgery attack
      secure: process.env.NODE_ENV != "development",
      path: "/",
    });

    const newUser = user.toObject({ getters: true });
    delete newUser.password;
    res.status(200).json({
      success: true,
      user: newUser,
      message: "Login successful.",
    });
  } catch (error) {
    console.log("error in login controller");
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// user logout
export const Logout = async (req, res) => {
  try {
    res.clearCookie("jwt");

    res.status(200).json({
      success: true,
      message: "Logout successful.",
    });
  } catch (error) {
    console.log("Error in logout controller ", error.message);
    req.status(500).json({ message: "Internal server error" });
  }
};

// google login
export const GoogleLogin = async (req, res, next) => {
  try {
    const { name, email, avatar } = req.body;

    let user;
    user = await User.findOne({ email });
    if (!user) {
      //  create new user
      const password = Math.round( Math.random()*22).toString();
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      const newUser = new User({
        name,
        email,
        password: hashedPassword,
        avatar,
      });

      user = await newUser.save();
    }

    const token = jwt.sign(
      {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    res.cookie("jwt", token, {
      maxAge: 7 * 24 * 60 * 60 * 1000, //in millisecond
      httpOnly: true, // prevent xss attack cross site scripting attack
      sameSite: "strict", // CSRF attacks cross site request forgery attack
      secure: process.env.NODE_ENV != "development",
      path: "/",
    });

    const newUser = user.toObject({ getters: true });
    console.log(newUser)
    delete newUser.password;
    res.status(200).json({
      success: true,
      user: newUser,
      message: "Login successful.",
    });
  } catch (error) {
    console.log("error in Google login controller");
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
