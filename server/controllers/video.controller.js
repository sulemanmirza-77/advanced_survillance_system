const Video = require("../models/video.model.js");
const asyncHandler = require("express-async-handler");

const uploadVideo = asyncHandler(async (req, res) => {
  try {
    const newVideo = await Video.create({
      userId: req.user.id,
      title: req.body.title,
      desc: req.body.desc,
      thumbnail_url: `http://localhost:5500/images/${req.savedImage}`,
      video_url: `http://localhost:5500/videos/${req.savedVideo}`,
    });

    await newVideo.save();
    res.status(200).json("Video has been uploaded successfully.");
  } catch (error) {
    res.status(500).json(error);
  }
});

const editVideo = asyncHandler(async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) {
      return res.status(404).json("User not found!");
    }

    if (req.user.id === video.userId.toString()) {
      const updatedVideo = await Video.findByIdAndUpdate(
        req.params.id,
        {
          $set: {
            title: req.body.title,
            desc: req.body.desc,
            thumbnail_url: req.savedImage
              ? `http://localhost:5500/images/${req.savedImage}`
              : video.thumbnail_url,
            video_url: req.savedVideo
              ? `http://localhost:5500/videos/${req.savedVideo}`
              : video.video_url,
          },
        },
        { new: true }
      );
      res.status(200).json(updatedVideo);
    } else {
      return res.status(404).json("You can only update your video!");
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

const deleteVideo = asyncHandler(async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) {
      return res.status(404).json("User not found!");
    }

    if (req.user.id === video.userId.toString()) {
      await Video.findByIdAndDelete(req.params.id);
      res.status(200).json("Your video is deleted successfully!");
    } else {
      return res.status(404).json("You can only delete your video!");
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

const getRandomVideo = asyncHandler(async (req, res) => {
  try {
    const videos = await Video.find().populate("userId");
    res.status(200).json(videos);
  } catch (error) {
    res.status(500).json(error);
  }
});

const getSomeVideos = asyncHandler(async (req, res) => {
  try {
    const videos = await Video.find().limit(10).populate("userId");
    res.status(200).json(videos);
  } catch (error) {
    res.status(500).json(error);
  }
});

const getVideoById = asyncHandler(async (req, res) => {
  try {
    const video = await Video.findById(req.params.id).populate("userId");
    res.status(200).json(video);
  } catch (error) {
    res.status(500).json(error);
  }
});

const increaseView = asyncHandler(async (req, res) => {
  try {
    await Video.findByIdAndUpdate(req.params.id, {
      $inc: { views: 1 },
    });
    res.status(200).json("Increment in view!");
  } catch (error) {
    res.status(500).json(error);
  }
});

const likeVideo = asyncHandler(async (req, res) => {
  try {
    await Video.findByIdAndUpdate(req.params.id, {
      $addToSet: { likes: req.user.id },
      $pull: { dislikes: req.user.id },
    });
    res.status(200).json("user like the video.");
  } catch (error) {
    res.status(500).json(error);
  }
});

const dislikeVideo = asyncHandler(async (req, res) => {
  try {
    await Video.findByIdAndUpdate(req.params.id, {
      $addToSet: { dislikes: req.user.id },
      $pull: { likes: req.user.id },
    });
  } catch (error) {
    res.status(500).json(error);
  }
});

const search = asyncHandler(async (req, res) => {
  try {
    const { query } = req.params;

    const videos = await Video.find({
      title: { $regex: query, $options: "i" },
    }).populate("userId");

    res.status(200).json(videos);
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = {
  uploadVideo,
  editVideo,
  deleteVideo,
  getRandomVideo,
  getSomeVideos,
  getVideoById,
  increaseView,
  likeVideo,
  dislikeVideo,
  search,
};
