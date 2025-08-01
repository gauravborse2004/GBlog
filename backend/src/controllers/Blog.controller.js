import cloudinary from "../config/cloudinary.js";
import Blog from "../models/blog.model.js";
import { encode } from "entities";
import Category from "../models/category.model.js";

export const addBlog = async (req, res) => {
  try {
    const data = JSON.parse(req.body.data);
    if (!data) {
      return res
        .status(400)
        .json({ success: false, message: "Data not found" });
    }
    let featuredImage = "";
    if (req.file) {
      // Upload an image
      const uploadResult = await cloudinary.uploader
        .upload(req.file.path, {
          folder: "GBlog",
          resource_type: "auto",
        })
        .catch((error) => {
          console.log("Error in image upload in add blog controller ", error);
          return res
            .status(400)
            .json({ success: false, message: "Image upload failed" });
        });

      featuredImage = uploadResult.secure_url;
    }

    const blog = new Blog({
      author: data.author,
      category: data.category,
      title: data.title,
      slug: data.slug,
      featuredImage: featuredImage,
      blogContent: encode(data.blogContent),
    });
    await blog.save();

    res
      .status(200)
      .json({ success: true, message: "Blog added successfully." });
  } catch (error) {
    console.log("Error in add blog controller", error);
    res
      .status(500)
      .json({ success: false, message: '"Error in add blog controller' });
  }
};

export const showAllBlog = async (req, res) => {
  try {
    const user = req.user;
    let blog;
    if (user.role === "admin") {
      blog = await Blog.find()
        .populate("author", "name avatar role")
        .populate("category", "name slug")
        .sort({ createdAt: -1 })
        .lean()
        .exec();
    } else {
      blog = await Blog.find({ author: user._id })
        .populate("author", "name avatar role")
        .populate("category", "name slug")
        .sort({ createdAt: -1 })
        .lean()
        .exec();
    }
    res.status(200).json({ blog });
  } catch (error) {
    console.log("Error in show all blog controller", error);
    res
      .status(500)
      .json({ success: false, message: '"Error in show all blog controller' });
  }
};

export const deleteBlog = async (req, res) => {
  try {
    const { blogid } = req.params;
    await Blog.findByIdAndDelete(blogid);
    res.status(200).json({
      success: true,
      message: "Blog Deleted successfully.",
    });
  } catch (error) {
    console.log("Error in delete blog controller", error);
    res
      .status(500)
      .json({ success: false, message: '"Error in delete blog controller' });
  }
};

export const editBlog = async (req, res) => {
  try {
    const { blogid } = req.params;
    const blog = await Blog.findById(blogid).populate("category", "name");
    if (!blog) {
      return res
        .status(400)
        .message({ success: false, message: "Data not found." });
    }
    res.status(200).json({ blog });
  } catch (error) {
    console.log("Error in edit blog controller", error);
    res
      .status(500)
      .json({ success: false, message: '"Error in edit blog controller' });
  }
};

export const updateBlog = async (req, res) => {
  try {
    const { blogid } = req.params;
    const data = JSON.parse(req.body.data);

    const blog = await Blog.findById(blogid);

    blog.category = data.category;
    blog.title = data.title;
    blog.slug = data.slug;
    blog.blogContent = encode(data.blogContent);

    let featuredImage = blog.featuredImage;

    if (req.file) {
      // Upload an image
      const uploadResult = await cloudinary.uploader
        .upload(req.file.path, {
          folder: "yt-mern-blog",
          resource_type: "auto",
        })
        .catch((error) => {
          console.log("Error in upload image in update blog controller");
          return res
            .status(400)
            .json({ success: false, message: "Failed to upload image" });
        });

      featuredImage = uploadResult.secure_url;
    }

    blog.featuredImage = featuredImage;

    await blog.save();

    res.status(200).json({
      success: true,
      message: "Blog updated successfully.",
    });
  } catch (error) {
    console.log("Error in update blog controller", error);
    res
      .status(500)
      .json({ success: false, message: '"Error in update blog controller' });
  }
};

export const getBlog = async (req, res) => {
  try {
    const { slug } = req.params;
    const blog = await Blog.findOne({ slug })
      .populate("author", "name avatar role")
      .populate("category", "name slug")
      .lean()
      .exec();
    res.status(200).json({ blog });
  } catch (error) {
    console.log("Error in get blog controller", error);
    res
      .status(500)
      .json({ success: false, message: '"Error in get blog controller' });
  }
};

export const getRelatedBlog = async (req, res) => {
  try {
    const { category, blog } = req.params;

    const categoryData = await Category.findOne({ slug: category });
    if (!categoryData) {
      return res
        .status(404)
        .json({ success: false, message: "Data not found" });
    }
    const categoryId = categoryData._id;
    const relatedBlog = await Blog.find({
      category: categoryId,
      slug: { $ne: blog },
    })
      .lean()
      .exec();
    res.status(200).json({ relatedBlog });
  } catch (error) {
    console.log("Error in get related controller", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const getBlogByCategory = async (req, res) => {
  try {
    const { category } = req.params;

    const categoryData = await Category.findOne({ slug: category });
    if (!categoryData) {
      return res
        .status(404)
        .json({ success: false, message: "Category data not found." });
    }
    const categoryId = categoryData._id;
    const blog = await Blog.find({ category: categoryId })
      .populate("author", "name avatar role")
      .populate("category", "name slug")
      .lean()
      .exec();
    res.status(200).json({ blog, categoryData });
  } catch (error) {
    console.log("Error in get Blog by category controller", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const search = async (req, res, next) => {
  try {
    const { q } = req.query;

    const blog = await Blog.find({ title: { $regex: q, $options: "i" } })
      .populate("author", "name avatar role")
      .populate("category", "name slug")
      .lean()
      .exec();
    console.log(blog);
    res.status(200).json({ blog });
  } catch (error) {
    console.log("Error in search blog controller", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const getAllBlogs = async (req, res, next) => {
  try {
    const user = req.user;
    const blog = await Blog.find()
      .populate("author", "name avatar role")
      .populate("category", "name slug")
      .sort({ createdAt: -1 })
      .lean()
      .exec();
    res.status(200).json({ blog });
  } catch (error) {
    console.log("Error in get all public blog controller", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
