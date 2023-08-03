const express = require("express");
const multer = require("multer");
const router = express.Router();
const Post = require("../models/post");

const MINE_TYPE_MAP = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/jpg": "jpg",
};
const storagePic = multer.diskStorage({
  destination: (req, file, cb) => {
    const isValid = MINE_TYPE_MAP[file.mimetype];
    let error = new Error("Invalid mine type");
    if (isValid) {
      error = null;
    }
    cb(error, "backend/images");
  },
  filename: (req, file, cb) => {
    const name = file.originalname.toLowerCase().split(" ").join("-");
    const ext = MINE_TYPE_MAP[file.mimetype];
    cb(null, name + "-" + Date.now() + "." + ext);
  },
});

router.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, DELETE, OPTIONS"
  );
  next();
});
console.log(storagePic);
router.post(
  "",
  multer({ storage: storagePic }).single("image"),
  (req, res, next) => {
    const post = new Post({
      title: req.body.title,
      content: req.body.content,
    });
    post.save().then((cretedPost) => {
      console.log(post);
      res.status(201).json({
        message: "Post added successfully",
        postId: cretedPost._id,
      });
    });
  }
);

router.get("", (req, res, next) => {
  Post.find().then((documents) => {
    res.status(200).json({
      message: "Posts fetched successfully!",
      posts: documents,
    });
  });
});

router.delete("/:id", (req, res, next) => {
  console.log(req.params.id);
  Post.deleteOne({
    _id: req.params.id,
  }).then((result) => {
    console.log(result);
  });
  res.status(200).json({
    message: "Post deleted",
  });
});

module.exports = router;
