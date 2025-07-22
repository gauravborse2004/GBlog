import { axiosInstance } from "@/lib/axios";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { Search } from "lucide-react";
import { toast } from "react-toastify";

// Get All Blogs
export const getAllBlogs = createAsyncThunk(
  "blog/getAll",
  async (_, thunkAPI) => {
    try {
      const res = await axiosInstance.get("/blog/get-all");
      return res.data.blog;
    } catch (err) {
      toast.error("Failed to fetch blogs");
      return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Get Single Blog for editing
export const getSingleBlog = createAsyncThunk(
  "blog/getSingle",
  async (id, thunkAPI) => {
    try {
      const res = await axiosInstance.get(`/blog/edit/${id}`);
      return res.data.blog;
    } catch (err) {
      toast.error("Failed to fetch blog");
      return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
  }
);

//  Add Blog
export const createBlog = createAsyncThunk(
  "blog/create",
  async ({ values, file, user }, thunkAPI) => {
    try {
      const newValues = { ...values, author: user.user._id };
      const formData = new FormData();
      formData.append("file", file);
      formData.append("data", JSON.stringify(newValues));

      const res = await axiosInstance.post("/blog/add", formData);
      toast.success(res.data.message || "Blog added");
      thunkAPI.dispatch(getAllBlogs());
      return res.data;
    } catch (err) {
      toast.error("Failed to add blog");
      return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
  }
);

//  Update Blog
export const editBlog = createAsyncThunk(
  "blog/update",
  async ({ id, values, file }, thunkAPI) => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("data", JSON.stringify(values));
      const res = await axiosInstance.put(`/blog/update/${id}`, formData);
      thunkAPI.dispatch(getAllBlogs());
      toast.success(res.data.message || "Blog updated");
      return res.data;
    } catch (err) {
      toast.error("Failed to update blog");
      return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
  }
);

//  Delete Blog
export const removeBlog = createAsyncThunk(
  "blog/delete",
  async (id, thunkAPI) => {
    try {
      const res = await axiosInstance.delete(`/blog/delete/${id}`);
      toast.success(res.data.message || "Blog deleted");
      thunkAPI.dispatch(getAllBlogs());
      return id;
    } catch (err) {
      toast.error("Failed to delete blog");
      return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Get Single Blog for editing
export const getSingleBlogDetails = createAsyncThunk(
  "blog/get-blog",
  async (blog, thunkAPI) => {
    try {
      const res = await axiosInstance.get(`/blog/get-blog/${blog}`);
      return res.data.blog;
    } catch (err) {
      toast.error("Failed to fetch blog");
      return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Get related blog
export const getRelatedBlog = createAsyncThunk(
  "/blog/get-related-blog",
  async ({ category, currentBlog }, thunkAPI) => {
    try {
      const res = await axiosInstance.get(
        `/blog/get-related-blog/${category}/${currentBlog}`
      );
      return res.data.relatedBlog;
    } catch (error) {
      toast.error("Failed to get related blog");
      return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
  }
);

// get blog by category
export const fetchBlogByCategory = createAsyncThunk(
  "blogByCategory/fetch",
  async (category, thunkAPI) => {
    try {
      const res = await axiosInstance.get(
        `/blog/get-blog-by-category/${category}`
      );
      return {
        blog: res.data.blog || [],
        categoryData: res.data.categoryData || {},
      };
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || "Failed to fetch");
    }
  }
);

// search blog
export const blogSearch = createAsyncThunk(
  "blog/search",
  async (q, thunkAPI) => {
    try {
      const res = await axiosInstance.get(`/blog/search?q=${q}`);
      return res.data.blog || [];
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data || "Failed to search blog"
      );
    }
  }
);

// get all blog public
export const ShowAllBlogs = createAsyncThunk(
  "blog/showAll",
  async (_, thunkAPI) => {
    try {
      const res = await axiosInstance.get("/blog/blogs");
      return res.data.blog;
    } catch (err) {
      toast.error("Failed to fetch blogs");
      return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
  }
);

const blogSlice = createSlice({
  name: "blog",
  initialState: {
    publicBlogs: [],
    blogs: [],
    relatedBlog: [],
    blogByCategory: [],
    categoryData: {},
    search: [],
    isSearch: false,
    isLoading: false,
    singleBlog: null,
    singleBlogDetails: null,
    isDeleteBlog: false,
    isAddBlog: false,
    isEditBlog: false,
    isUpdateBlog: false,
    issingleBlog: false,
    isRelatedBlogLoading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder

      // Get All Blogs
      .addCase(getAllBlogs.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllBlogs.fulfilled, (state, action) => {
        state.isLoading = false;
        state.blogs = action.payload;
      })
      .addCase(getAllBlogs.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Get Single Blog for editing
      .addCase(getSingleBlog.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getSingleBlog.fulfilled, (state, action) => {
        state.isLoading = false;
        state.singleBlog = action.payload;
      })
      .addCase(getSingleBlog.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Add Blog
      .addCase(createBlog.pending, (state) => {
        state.isAddBlog = true;
      })
      .addCase(createBlog.fulfilled, (state) => {
        state.isAddBlog = false;
      })
      .addCase(createBlog.rejected, (state, action) => {
        state.isAddBlog = false;
        state.error = action.payload;
      })

      // Edit Blog
      .addCase(editBlog.pending, (state) => {
        state.isEditBlog = true;
      })
      .addCase(editBlog.fulfilled, (state) => {
        state.isEditBlog = false;
      })
      .addCase(editBlog.rejected, (state, action) => {
        state.isEditBlog = false;
        state.error = action.payload;
      })

      // Delete Blog
      .addCase(removeBlog.pending, (state) => {
        state.isDeleteBlog = true;
      })
      .addCase(removeBlog.fulfilled, (state) => {
        state.isDeleteBlog = false;
      })
      .addCase(removeBlog.rejected, (state, action) => {
        state.isDeleteBlog = false;
        state.error = action.payload;
      })

      // Get Single Blog details
      .addCase(getSingleBlogDetails.pending, (state) => {
        state.issingleBlog = true;
      })
      .addCase(getSingleBlogDetails.fulfilled, (state, action) => {
        state.issingleBlog = false;
        state.singleBlogDetails = action.payload;
      })
      .addCase(getSingleBlogDetails.rejected, (state, action) => {
        state.issingleBlog = false;
        state.error = action.payload;
      })

      // get related blog
      .addCase(getRelatedBlog.pending, (state) => {
        state.isRelatedBlogLoading = true;
      })
      .addCase(getRelatedBlog.fulfilled, (state, action) => {
        state.isRelatedBlogLoading = false;
        state.relatedBlog = action.payload;
      })
      .addCase(getRelatedBlog.rejected, (state, action) => {
        state.isRelatedBlogLoading = false;
        state.error = action.payload;
      })

      // get blog by category
      .addCase(fetchBlogByCategory.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchBlogByCategory.fulfilled, (state, action) => {
        state.isLoading = false;
        state.blogByCategory = action.payload.blog;
        state.categoryData = action.payload.categoryData;
      })
      .addCase(fetchBlogByCategory.rejected, (state, action) => {
        state.isLoading = false;
        state.blogByCategory = [];
        state.categoryData = {};
        state.error = action.payload || "Something went wrong";
      })

      // search blog
      .addCase(blogSearch.pending, (state) => {
        state.isSearch = true;
      })
      .addCase(blogSearch.fulfilled, (state, action) => {
        state.isSearch = false;
        state.search = action.payload;
      })
      .addCase(blogSearch.rejected, (state, action) => {
        state.isSearch = false;
      })
      // Get All Blogs public
      .addCase(ShowAllBlogs.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(ShowAllBlogs.fulfilled, (state, action) => {
        state.isLoading = false;
        state.publicBlogs = action.payload;
      })
      .addCase(ShowAllBlogs.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export default blogSlice.reducer;
