/* User Model */
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const { Schema } = mongoose;

const UserSchema = new Schema(
  {
    name: {
      type: Schema.Types.String,
      required: [true, "Please provide a name"],
    },
    email: {
      type: Schema.Types.String,
      required: true,
      unique: [true, "Please provide an different e-mail"],
      match: [
        /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/,
        "Please provide a valid e-mail",
      ],
    },
    password: {
      type: Schema.Types.String,
      required: true,
      minlength: [6, "Please provide a longer password than your input."],
      select: false,
    },
    role: {
      type: Schema.Types.String,
      default: "user",
      enum: ["user", "admin"],
    },
    profile_image: {
      type: Schema.Types.String,
      default:
        "https://i.pinimg.com/736x/83/bc/8b/83bc8b88cf6bc4b4e04d153a418cde62.jpg",
    },
    about: {
      type: Schema.Types.String,
    },
    subscribers: {
      type: [Schema.Types.ObjectId],
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    blocked: {
      type: Schema.Types.Boolean,
      default: false,
    },
    emailVerified: {
      type: Schema.Types.Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

UserSchema.pre("save", function (next) {
  /* This method will not work if the user password has not changed. */
  if (!this.isModified("password")) {
    next();
  }
  /* The bcryptjs package is used for encryption operations. */
  bcrypt.genSalt(10, (err, salt) => {
    if (err) next(err);

    bcrypt.hash(this.password, salt, (err, hash) => {
      if (err) next(err);
      this.password = hash;
      next();
    });
  });
});

module.exports = mongoose.model("User", UserSchema);
