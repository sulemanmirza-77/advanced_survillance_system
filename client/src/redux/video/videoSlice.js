import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import videoService from "./videoService";

const initialState = {
  randomVideos: [],
  currentVideo: {},
  someVideos: [],
  searchedVideos: [],
  isLoading: false,
  isError: false,
  message: "",
};

export const getRandomVideo = createAsyncThunk(
  "video/random",
  async (_, thunkAPI) => {
    try {
      return await videoService.getRandomVideo();
    } catch (error) {
      const message =
        (error.message && error.message.data && error.message.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const getSomeVideo = createAsyncThunk(
  "video/some",
  async (_, thunkAPI) => {
    try {
      return await videoService.getSomeVideo();
    } catch (error) {
      const message =
        (error.message && error.message.data && error.message.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const getVideoById = createAsyncThunk(
  "video/byId",
  async (videoId, thunkAPI) => {
    try {
      return await videoService.getVideoById(videoId);
    } catch (error) {
      const message =
        (error.message && error.message.data && error.message.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const getSearchVideos = createAsyncThunk(
  "video/search",
  async (query, thunkAPI) => {
    try {
      return await videoService.getSearchVideos(query);
    } catch (error) {
      const message =
        (error.message && error.message.data && error.message.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

const videoSlice = createSlice({
  name: "video",
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isError = false;
      state.message = "";
      state.randomVideos = [];
      state.currentVideo = {};
      state.someVideos = [];
      state.searchedVideos = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getRandomVideo.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getRandomVideo.fulfilled, (state, action) => {
        state.isLoading = false;
        state.randomVideos = action.payload;
      })
      .addCase(getRandomVideo.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        state.randomVideos = [];
      })
      .addCase(getSomeVideo.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getSomeVideo.fulfilled, (state, action) => {
        state.isLoading = false;
        state.someVideos = action.payload;
      })
      .addCase(getSomeVideo.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        state.someVideos = [];
      })
      .addCase(getVideoById.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getVideoById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentVideo = action.payload;
      })
      .addCase(getVideoById.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        state.currentVideo = {};
      })
      .addCase(getSearchVideos.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getSearchVideos.fulfilled, (state, action) => {
        state.isLoading = false;
        state.searchedVideos = action.payload;
      })
      .addCase(getSearchVideos.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        state.searchedVideos = [];
      });
  },
});

export const { reset } = videoSlice.actions;
export default videoSlice.reducer;
