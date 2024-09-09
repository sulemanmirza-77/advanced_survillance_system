import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import userService from "./userService";

const initialState = {
  userDetail: {},
  userVideos: [],
  isLoading: false,
  isError: false,
  message: "",
};

export const getUserDetail = createAsyncThunk(
  "user/getDetail",
  async (id, thunkAPI) => {
    try {
      return await userService.getUser(id);
    } catch (error) {
      const message =
        (error.message && error.message.data && error.message.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const getVideoByUser = createAsyncThunk(
  "user/videos",
  async (userId, thunkAPI) => {
    try {
      return await userService.getVideoByUser(userId);
    } catch (error) {
      const message =
        (error.message && error.message.data && error.message.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isError = false;
      state.message = "";
      state.userDetail = {};
      state.userVideos = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getUserDetail.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getUserDetail.fulfilled, (state, action) => {
        state.isLoading = false;
        state.userDetail = action.payload;
      })
      .addCase(getUserDetail.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        state.userDetail = {};
      })
      .addCase(getVideoByUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getVideoByUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.userVideos = action.payload;
      })
      .addCase(getVideoByUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        state.userVideos = [];
      });
  },
});

export const { reset } = userSlice.actions;
export default userSlice.reducer;
