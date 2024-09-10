/* Express Router */
const router = require("express").Router();
/* Video Controller */
const {
  uploadVideo,
  getRandomVideo,
  getVideoById,
  increaseView,
  likeVideo,
  dislikeVideo,
  editVideo,
  deleteVideo,
  getSomeVideos,
  search,
} = require("../controllers/video.controller");
/* JWT Auth Middleware */
const { getAccessToRoute } = require("../middleware/auth/auth");
/* Upload Video with Multer */
const uploadFile = require("../middleware/multer/multerVideoConfig.js");

/* Create a Video
   http://10.128.0.5:5500/api/video/ (http post method) */
router.post(
  "/",
  [
    getAccessToRoute,
    uploadFile.fields([
      { name: "image", maxCount: 1 },
      { name: "file", maxCount: 1 },
    ]),
  ],
  uploadVideo
);
/* Edit a Video
   http://10.128.0.5:5500/api/video/edit/:id (http put method) */
router.put(
  "/edit/:id",
  [
    getAccessToRoute,
    uploadFile.fields([
      { name: "image", maxCount: 1 },
      { name: "file", maxCount: 1 },
    ]),
  ],
  editVideo
);
/* Delete a video
   http://10.128.0.5:5500/api/video/delete/:id (http delete method) */
router.delete("/delete/:id", getAccessToRoute, deleteVideo);
/* Get Random Videos
   http://10.128.0.5:5500/api/video/random (http get method) */
router.get("/random", getRandomVideo);
/* Get Some Videos
   http://10.128.0.5:5500/api/video/some (http get method) */
router.get("/some", getSomeVideos);
/* Get Video by Id
   http://10.128.0.5:5500/api/video/:id (http get method) */
router.get("/:id", getVideoById);
/* Add View to a Video
   http://10.128.0.5:5500/api/video/view/:id (http put method) */
router.put("/view/:id", increaseView);
/* Like a Video
   http://10.128.0.5:5500/api/video/like/:id (http put method) */
router.put("/like/:id", getAccessToRoute, likeVideo);
/* Dislike a Video
   http://10.128.0.5:5500/api/video/dislike/:id (http put method) */
router.put("/dislike/:id", getAccessToRoute, dislikeVideo);
/* Search Video by Title
   http://10.128.0.5:5500/api/video/search/:query (http get method) */
router.get("/search/:query", search);

module.exports = router;
