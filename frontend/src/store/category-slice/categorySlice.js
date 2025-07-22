import { axiosInstance } from "@/lib/axios";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

// Fetch all categories
export const fetchCategories = createAsyncThunk(
  "category/fetchAll",
  async (_, thunkAPI) => {
    try {
      const res = await axiosInstance.get("/category/all-category");
      return res.data.category;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Failed to fetch categories"
      );
    }
  }
);

// Add category
export const addCategory = createAsyncThunk(
  "category/add",
  async (data, thunkAPI) => {
    try {
      const { dispatch } = thunkAPI;
      const res = await axiosInstance.post("/category/add", data);
      dispatch(fetchCategories());
      toast.success("Category Added");
      return res.data;
    } catch (err) {
      toast.error("Failed to add category");
      return thunkAPI.rejectWithValue(err.response?.data?.message);
    }
  }
);

// Update category
export const updateCategory = createAsyncThunk(
  "category/update",
  async ({ id, data }, thunkAPI) => {
    try {
      const { dispatch } = thunkAPI;
      const res = await axiosInstance.put(`/category/update/${id}`, data);
      dispatch(fetchCategories());
      toast.success(res.data.message || "Category updated");
      return res.data.category;
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update category");
      return thunkAPI.rejectWithValue(err.response?.data?.message);
    }
  }
);

// Delete category
export const deleteCategory = createAsyncThunk(
  "category/delete",
  async (id, thunkAPI) => {
    try {
      const { dispatch } = thunkAPI;
      const res = await axiosInstance.delete(`/category/delete/${id}`);
      dispatch(fetchCategories());
      toast.success(res.data.message || "Category deleted");
      return res.data;
    } catch (err) {
      toast.error("Failed to delete category");
      return thunkAPI.rejectWithValue(err.response?.data?.message);
    }
  }
);

// Get single category
export const getSingleCategory = createAsyncThunk(
  "category/getSingle",
  async (id, thunkAPI) => {
    try {
      const res = await axiosInstance.get(`/category/show/${id}`);
      return res.data.category;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message);
    }
  }
);

const categorySlice = createSlice({
  name: "category",
  initialState: {
    categoryList: [],
    selectedCategory: null,
    loading: false,
    error: null,
    isDeleteCategory: false,
    isAddCategory: false,
    isEditCategory: false,
    isUpdateCategory: false,
  },
  reducers: {
    resetSelectedCategory: (state) => {
      state.selectedCategory = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetch category
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.categoryList = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // add category
      .addCase(addCategory.pending, (state) => {
        state.isAddCategory = true;
      })
      .addCase(addCategory.fulfilled, (state) => {
        state.isAddCategory = false;
      })
      .addCase(addCategory.rejected, (state, action) => {
        state.isAddCategory = false;
        state.error = action.payload;
      })

      //   update category
      .addCase(updateCategory.pending, (state) => {
        state.isUpdateCategory = true;
      })
      .addCase(updateCategory.fulfilled, (state, action) => {
        state.isUpdateCategory = true;
        state.selectedCategory = action.payload;
      })
      .addCase(updateCategory.rejected, (state, action) => {
        state.isUpdateCategory = false;
        state.error = action.payload;
      })

      //   delete category
      .addCase(deleteCategory.pending, (state) => {
        state.isDeleteCategory = true;
      })
      .addCase(deleteCategory.rejected, (state, action) => {
        state.isDeleteCategory = false;
        state.error = action.payload;
      })
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.isDeleteCategory = false;
      })

      //   get single category
      .addCase(getSingleCategory.fulfilled, (state, action) => {
        state.selectedCategory = action.payload;
      });
  },
});

export const { resetSelectedCategory } = categorySlice.actions;
export default categorySlice.reducer;
