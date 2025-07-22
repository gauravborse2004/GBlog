import User from "../models/user.model.js";
import cloudinary from "../config/cloudinary.js";

export const updateUser = async (req, res) => {
  try {
    const { userId, name, bio } = req.body;

    const user = await User.findById(userId);
    user.name = name;
    user.bio = bio;

    if (req.file) {
      // Upload an image
      const uploadResult = await cloudinary.uploader
        .upload(req.file.path, {
          folder: "GBlog",
          resource_type: "auto",
        })
        .catch((error) => {
          next(handleError(500, error.message));
        });

      user.avatar = uploadResult.secure_url;
    }

    await user.save();

    const newUser = user.toObject({ getters: true });
    delete newUser.password;
    res.status(200).json({
      success: true,
      message: "Data updated.",
      user: newUser,
    });
  } catch (error) {
    console.log("error in update user controller ", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const getUser = async (req, res) => {
  try {
    const { userid } = req.params;
    const user = await User.findOne({ _id: userid }).lean().exec();
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found." });
    }
    res.status(200).json({ success: true, message: "User data found.", user });
  } catch (error) {
    console.log("error in get user controller ", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const getAllUser = async (req, res, next) => {
  try {
    const user = await User.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.log("error in get all user controller ", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await User.findByIdAndDelete(id);
    res.status(200).json({ success: true, message: "Data deleted." });
  } catch (error) {
    console.log("error in delete user controller ", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
