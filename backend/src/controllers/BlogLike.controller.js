import BlogLike from "../models/bloglike.model.js";

export const doLike = async (req, res) => {
  try {
    const { user, blogid } = req.body;
    let like;
    like = await BlogLike.findOne({ user, blogid });
    if (!like) {
      const saveLike = new BlogLike({
        user,
        blogid,
      });
      like = await saveLike.save();
    } else {
      await BlogLike.findByIdAndDelete(like._id);
    }

    const likecount = await BlogLike.countDocuments({ blogid });

    res.status(200).json({ likecount });
  } catch (error) {
    console.log("Error in do like controller", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const likeCount = async (req, res) => {
  try {
    const { blogid, userid } = req.params;
    const likecount = await BlogLike.countDocuments({ blogid });

    let isUserliked = false;
    if (userid) {
      const getuserlike = await BlogLike.countDocuments({
        blogid,
        user: userid,
      });
      if (getuserlike > 0) {
        isUserliked = true;
      }
    }

    res.status(200).json({
      likecount,
      isUserliked,
    });
  } catch (error) {
    console.log("Error in do like controller", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
