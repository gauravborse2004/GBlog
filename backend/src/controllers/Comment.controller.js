import Comment from "../models/comment.model.js";

export const addcomment = async (req, res) => {
  try {
    const { user, blogid, comment } = req.body;
    const newComment = new Comment({
      user: user,
      blogid: blogid,
      comment: comment,
    });

    await newComment.save();
    res.status(200).json({
      success: true,
      message: "Comment submited.",
      comment: newComment,
    });
  } catch (error) {
    console.log("Error in add comment controller", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const getComments = async (req, res) => {
  try {
    const { blogid } = req.params;
    const comments = await Comment.find({ blogid })
      .populate("user", "name avatar")
      .sort({ createdAt: -1 })
      .lean()
      .exec();

    res.status(200).json({ comments });
  } catch (error) {
    console.log("Error in get comment controller", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const commentCount = async (req, res) => {
  try {
    const { blogid } = req.params;
    const commentCount = await Comment.countDocuments({ blogid });
    res.status(200).json({ commentCount });
  } catch (error) {
    console.log("Error in comment count controller", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const getAllComments = async (req, res) => {
  try {
    const user = req.user;
    let comments;
    if (user.role === "admin") {
      comments = await Comment.find()
        .populate("blogid", "title")
        .populate("user", "name");
    } else {
      comments = await Comment.find({ user: user._id })
        .populate("blogid", "title")
        .populate("user", "name");
    }

    res.status(200).json({
      comments,
    });
  } catch (error) {
    console.log("Error in get all comment controller", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const deleteComment = async (req, res) => {
  try {
    const { commentid } = req.params;
    await Comment.findByIdAndDelete(commentid);

    res.status(200).json({ success: true, message: "Data deleted" });
  } catch (error) {
    console.log("Error in delete comment  controller", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
