const User = require("../models/user.model");
const Video = require("../models/video.model.js");
const asyncHandler = require("express-async-handler");

const getUser = asyncHandler(async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(401).json("User is not exist.");
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json(error);
  }
});

const getVideoByUser = asyncHandler(async (req, res) => {
  try {
    const videos = await Video.find({ userId: req.params.id }).populate(
      "userId"
    );
    if (!videos) {
      return res.status(401).json("User videos are not available.");
    }
    res.status(200).json(videos);
  } catch (error) {
    res.status(500).json(error);
  }
});

const updateProfile = asyncHandler(async (req, res) => {
  try {
    if (req.params.id === req.user.id) {
      const updatedProfile = await User.findByIdAndUpdate(req.params.id, {
        $set: {
          profile_image: `http://localhost:5500/images/${req.savedProfileImage}`,
          about: req.body.about,
        },
      });
      res.status(200).json(updatedProfile);
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

const subscribeUser = asyncHandler(async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.params.id, {
      $addToSet: { subscribers: req.user.id },
    });

    res.status(200).json("Subscribe Successful!");
  } catch (error) {
    res.status(500).json(error);
  }
});

const unSubscribeUser = asyncHandler(async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.params.id, {
      $pull: { subscribers: req.user.id },
    });
    res.status(200).json("Unsubscribe Successful!");
  } catch (error) {
    res.status(500).json(error);
  }
});



module.exports = {
  getUser,
  updateProfile,
  getVideoByUser,
  subscribeUser,
  unSubscribeUser,
};
