/* Video Model */
const mongoose = require("mongoose");
const { Schema } = mongoose;
const VideoSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: Schema.Types.String,
      required: true,
    },
    desc: {
      type: Schema.Types.String,
      required: true,
    },
    thumbnail_url: {
      type: Schema.Types.String,
      required: true,
    },
    video_url: {
      type: Schema.Types.String,
      required: true,
    },
    views: {
      type: Schema.Types.Number,
      default: 0,
    },
    tags: {
      type: [Schema.Types.String],
      default: [],
    },
    likes: {
      type: [Schema.Types.ObjectId],
    },
    dislikes: {
      type: [Schema.Types.ObjectId],
    },
    commentClosed: {
      type: Schema.Types.Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Video", VideoSchema);
