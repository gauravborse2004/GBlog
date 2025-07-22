import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "@/lib/axios";
import { toast } from "react-toastify";

export const signup = createAsyncThunk(
  "/auth/register",
  async (data, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post("/auth/register", data);
      toast.success("Account created successfully");
      return res.data;
    } catch (error) {
      toast.error(error.response?.data?.message || "Signup failed");
      return rejectWithValue(error.response?.data);
    }
  }
);

export const login = createAsyncThunk(
  "/auth/login",
  async (data, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post("/auth/login", data);
      toast.success("Logged in successfully");
      return res.data;
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
      return rejectWithValue(error.response?.data);
    }
  }
);

export const logout = createAsyncThunk(
  "/auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      await axiosInstance.get("/auth/logout");
      toast.success("Logout successful");
      return null;
    } catch (error) {
      toast.error(error.response?.data?.message || "Logout failed");
      return rejectWithValue(error.response?.data);
    }
  }
);

export const updateProfile = createAsyncThunk(
  "/user/updateProfile",
  async (data, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.put("/user/updateProfile", data);
      toast.success("Profile updated successfully");
      return res.data;
    } catch (error) {
      console.error("Error in updateProfile: ", error);
      toast.error(error.response?.data?.message || "Profile update failed");
      return rejectWithValue(error.response?.data);
    }
  }
);

export const GoogleLoginFirebase = createAsyncThunk(
  "/auth/google-login",
  async (data, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post("/auth/google-login", data);
      toast.success("Logged in successfully");
      return res.data;
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
      return rejectWithValue(error.response?.data);
    }
  }
);

// Initial State

const initialState = {
  authUser: null,
  isCheckingAuth: true,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
};

// Slice

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    resetAuthState: (state) => {
      state.authUser = null;
    },
  },
  extraReducers: (builder) => {
    builder

      // Signup
      .addCase(signup.pending, (state) => {
        state.isSigningUp = true;
      })
      .addCase(signup.fulfilled, (state, action) => {
        state.isSigningUp = false;
      })
      .addCase(signup.rejected, (state) => {
        state.isSigningUp = false;
      })

      // Login
      .addCase(login.pending, (state) => {
        state.isLoggingIn = true;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoggingIn = false;
        state.authUser = action.payload;
      })
      .addCase(login.rejected, (state) => {
        state.isLoggingIn = false;
      })

      //Google Login
      .addCase(GoogleLoginFirebase.pending, (state) => {
        state.isLoggingIn = true;
      })
      .addCase(GoogleLoginFirebase.fulfilled, (state, action) => {
        state.isLoggingIn = false;
        state.authUser = action.payload;
      })
      .addCase(GoogleLoginFirebase.rejected, (state) => {
        state.isLoggingIn = false;
      })

      // Logout
      .addCase(logout.fulfilled, (state) => {
        state.authUser = null;
      })

      // Update Profile
      .addCase(updateProfile.pending, (state) => {
        state.isUpdatingProfile = true;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.isUpdatingProfile = false;
        state.authUser = action.payload;
      })
      .addCase(updateProfile.rejected, (state) => {
        state.isUpdatingProfile = false;
      });
  },
});

export const { resetAuthState } = authSlice.actions;

export default authSlice.reducer;
