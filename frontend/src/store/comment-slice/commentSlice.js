import { axiosInstance } from "@/lib/axios";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

// Thunks
export const fetchComments = createAsyncThunk(
  "comment/fetchComments",
  async (blogid, thunkAPI) => {
    try {
      const res = await axiosInstance.get(`/comment/get/${blogid}`);
      return res.data;
    } catch (error) {
      toast.error("Error in fetching comments.");
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchCommentCount = createAsyncThunk(
  "comment/fetchCommentCount",
  async (blogid, thunkAPI) => {
    try {
      const res = await axiosInstance.get(`/comment/get-count/${blogid}`);
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const addComment = createAsyncThunk(
  "comment/addComment",
  async ({ values, blogid, user }, thunkAPI) => {
    try {
      const newValues = { ...values, blogid, user };
      const res = await axiosInstance.post("/comment/add", newValues);
      thunkAPI.dispatch(fetchCommentCount(blogid));
      thunkAPI.dispatch(fetchComments(blogid));
      toast.success(res.message || "Comment Added");
      return res.data.comment;
    } catch (error) {
      toast.error("Failed to add comment to blog");
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchAllComments = createAsyncThunk(
  "/comment/get-all-comment",
  async (thunkAPI) => {
    try {
      const res = await axiosInstance.get(`/comment/get-all-comment`);
      return res.data.comments;
    } catch (error) {
      toast.error("Error in fetching comments.");
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const deleteComments = createAsyncThunk(
  "/comment/delete",
  async (id, thunkAPI) => {
    try {
      const res = await axiosInstance.delete(`/comment/delete/${id}`);
      thunkAPI.dispatch(fetchAllComments());
      toast.success("Comment deleted");
      return res.data;
    } catch (error) {
      toast.error("Error in delete comment.");
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Slice
const commentSlice = createSlice({
  name: "comment",
  initialState: {
    comments: [],
    allComments: [],
    isAllcommentLoading: false,
    count: 0,
    newComment: null,
    isLoading: false,
    error: null,
  },
  reducers: {
    clearNewComment: (state) => {
      state.newComment = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchComments
      .addCase(fetchComments.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchComments.fulfilled, (state, action) => {
        state.isLoading = false;
        state.comments = action.payload;
      })
      .addCase(fetchComments.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // fetchCommentCount
      .addCase(fetchCommentCount.fulfilled, (state, action) => {
        state.count = action.payload.commentCount || 0;
      })

      // addComment
      .addCase(addComment.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addComment.fulfilled, (state, action) => {
        state.isLoading = false;
        state.newComment = action.payload;
      })
      .addCase(addComment.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // get all comments
      .addCase(fetchAllComments.pending, (state) => {
        state.isAllcommentLoading = true;
        state.error = null;
      })
      .addCase(fetchAllComments.fulfilled, (state, action) => {
        state.isAllcommentLoading = false;
        state.allComments = action.payload;
      })
      .addCase(fetchAllComments.rejected, (state, action) => {
        state.isAllcommentLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearNewComment } = commentSlice.actions;
export default commentSlice.reducer;
