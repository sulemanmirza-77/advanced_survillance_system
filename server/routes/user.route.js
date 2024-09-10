/*  Express Router*/
const router = require("express").Router();
/* User Controller */
const {
  getUser,
  updateProfile,
  getVideoByUser,
  subscribeUser,
  unSubscribeUser,
} = require("../controllers/user.controller");
/* JWT Auth Middleware */
const { getAccessToRoute } = require("../middleware/auth/auth.js");
/* Profile Image Multer */
const multerUploadProfileImage = require("../middleware/multer/multerImageConfig");

/* Find an User
   http://10.128.0.5:5500/api/user/:id (http get method) */
router.get("/:id", getUser);
/* Update an Profile & Change the Profile Image
   http://10.128.0.5:5500/api/user/update/:id (http put method) */
router.put(
  "/update/:id",
  [getAccessToRoute, multerUploadProfileImage.single("file")],
  updateProfile
);
/* Find an User's Videos
   http://10.128.0.5:5500/api/user/videos/:id (http get method) */
router.get("/videos/:id", getVideoByUser);
/* Subscribe an User
   http://10.128.0.5:5500/api/user/sub/:id (http put method) */
router.put("/sub/:id", getAccessToRoute, subscribeUser);
/* Unsubscribe an User
   http://10.128.0.5:5500/api/user/unSub/:id (http put method) */
router.put("/unSub/:id", getAccessToRoute, unSubscribeUser);

module.exports = router;
