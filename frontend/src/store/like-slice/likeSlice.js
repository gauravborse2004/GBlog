import { axiosInstance } from "@/lib/axios";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

// Get Like Count
export const fetchLikeStatus = createAsyncThunk(
  "like/fetchLikeStatus",
  async ({ blogid, userid }, thunkAPI) => {
    try {
      const res = await axiosInstance.get(
        `/blog-like/get-like/${blogid}/${userid}`
      );
      return res.data;
    } catch (error) {
      toast.error("Login to see likes count");
      console.log(error);
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Do Like / Unlike
export const toggleLike = createAsyncThunk(
  "like/toggleLike",
  async ({ blogid, userid }, thunkAPI) => {
    try {
      const res = await axiosInstance.post("/blog-like/do-like", {
        user: userid,
        blogid: blogid,
      });
      thunkAPI.dispatch(fetchLikeStatus({ blogid: blogid, userid: userid }));
      return res.data;
    } catch (error) {
      toast.error("Error in like the blog");
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Slice
const likeSlice = createSlice({
  name: "like",
  initialState: {
    likeCount: 0,
    hasLiked: false,
    isLoading: false,
    error: null,
  },
  reducers: {
    resetLikeState: (state) => {
      state.likeCount = 0;
      state.hasLiked = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchLikeStatus
      .addCase(fetchLikeStatus.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchLikeStatus.fulfilled, (state, action) => {
        state.isLoading = false;
        state.likeCount = action.payload.likecount || 0;
        state.hasLiked = action.payload.isUserliked || false;
      })
      .addCase(fetchLikeStatus.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // toggleLike
      .addCase(toggleLike.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(toggleLike.fulfilled, (state, action) => {
        state.isLoading = false;
        state.likeCount = action.payload.likecount || 0;
      })
      .addCase(toggleLike.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { resetLikeState } = likeSlice.actions;
export default likeSlice.reducer;
