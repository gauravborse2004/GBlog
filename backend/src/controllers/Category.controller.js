import Category from "../models/category.model.js";

export const addCategory = async (req, res) => {
  try {
    const { name, slug } = req.body;
    const category = new Category({
      name,
      slug,
    });

    await category.save();

    res
      .status(200)
      .json({ success: true, message: "Category added successfully." });
  } catch (error) {
    console.log("Error in add category controller ", error);
    res.status(500).json({ success: false, message: "Internal Server Error." });
  }
};

export const getAllCategory = async (req, res, next) => {
  try {
    const category = await Category.find().sort({ name: 1 }).lean().exec();
    res.status(200).json({ category });
  } catch (error) {
    console.log("Error in get all category controller ", error);
    res.status(500).json({ success: false, message: "Internal Server Error." });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const { categoryid } = req.params;
    await Category.findByIdAndDelete(categoryid);
    res
      .status(200)
      .json({ success: true, message: "Category Deleted successfully." });
  } catch (error) {
    console.log("Error in delete category controller ", error);
    res.status(500).json({ success: false, message: "Internal Server Error." });
  }
};

export const showCategory = async (req, res) => {
  try {
    const { categoryid } = req.params;
    const category = await Category.findById(categoryid);
    if (!category) {
      return res
        .status(400)
        .json({ success: false, message: "category not found" });
    }
    res.status(200).json({ category });
  } catch (error) {
    console.log("Error in show category controller ", error);
    res.status(500).json({ success: false, message: "Internal Server Error." });
  }
};

export const updateCategory = async (req, res) => {
  try {
    const { name, slug } = req.body;
    const { categoryid } = req.params;
    const category = await Category.findByIdAndUpdate(
      categoryid,
      {
        name,
        slug,
      },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Category updated successfully.",
      category,
    });
  } catch (error) {
    console.log("Error in delete category controller ", error);
    res.status(500).json({ success: false, message: "Internal Server Error." });
  }
};
