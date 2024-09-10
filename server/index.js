const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const morgan = require("morgan");
const path = require("path");
const authRoute = require("./routes/auth.route.js");
const userRoute = require("./routes/user.route.js");
const videoRoute = require("./routes/video.route.js");

require("dotenv").config();
const app = express();

/* Express Static Files */
app.use("/images", express.static(path.join(__dirname, "public/images")));
app.use("/videos", express.static(path.join(__dirname, "public/videos")));

/* Middleware */
app.use(
  cors({
    origin: "http://10.128.0.5:3000",
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(helmet());
app.use(morgan("dev"));

/* Routes */
app.use("/api/auth", authRoute);
app.use("/api/user", userRoute);
app.use("/api/video", videoRoute);

const PORT = process.env.PORT || 5500;
const { MONGO_USERNAME, MONGO_PASSWORD } = process.env;

/* MongoDB Connection */
mongoose
  .connect(
    // `mongodb://${MONGO_USERNAME}:${MONGO_PASSWORD}@ac-6vo8h6r-shard-00-00.6hewl1m.mongodb.net:27017,ac-6vo8h6r-shard-00-01.6hewl1m.mongodb.net:27017,ac-6vo8h6r-shard-00-02.6hewl1m.mongodb.net:27017/?ssl=true&replicaSet=atlas-13w5qh-shard-0&authSource=admin&retryWrites=true&w=majority`,
    `mongodb+srv://${MONGO_USERNAME}:${MONGO_PASSWORD}@cluster0.t93p3.mongodb.net/yourDatabaseName?retryWrites=true&w=majority`,

    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => {
    /* Express Server */
    app.listen(PORT, () => {
      console.log(`Server is setup on http://localhost:${PORT}`);
    });
  })
  .catch((err) => console.log(`Something is wrong with server: ${err}`));
