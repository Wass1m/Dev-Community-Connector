const express = require("express");

const router = express.Router();

const auth = require("../../middleware/auth");

const { check, validationResult } = require("express-validator");

const Post = require("../../models/Post");
const User = require("../../models/User");
const { route } = require("./user");

router.post(
  "/",
  [auth, [check("text", "Text is required").not().isEmpty()]],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return rest.status(400).json({ errors: errors.array() });
    }

    try {
      const user = await User.findById(req.user.id).select("-password");

      console.log(user);

      const newPost = new Post({
        text: req.body.text,
        user: user._id,
        name: user.name,
        avatar: user.avatar,
      });

      const post = await newPost.save();

      res.json(post);
    } catch (error) {
      console.error(error.message);
      return res.status(500).send("SERVER ERROR");
    }
  }
);

// GET /api/post
// desc get all posts
// type private

router.get("/", auth, async (req, res) => {
  try {
    let posts = await Post.find().sort({ date: -1 }); // most recent
    res.json(posts);
  } catch (error) {
    console.error(error.message);
    return res.status(500).send("SERVER ERROR");
  }
});

// GET /api/post/:id
// desc get all posts
// type private

router.get("/:id", auth, async (req, res) => {
  try {
    let post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(400).json({ msg: "NO POST FOUND" });
    }
    res.json(post);
  } catch (error) {
    if (error.kind == "ObjectId") {
      return res.status(404).json({ msg: "POST NOT FOUND" });
    }
    return res.status(500).send("SERVER ERROR");
  }
});

// desc get all posts
// type private

// DELETE /api/post/// GET /api/post
// desc get all posts
// type private
router.delete("/:post_id", auth, async (req, res) => {
  try {
    let post = await Post.findById(req.params.post_id);

    if (!post) {
      res.status(400).json({ msg: "post not found" });
    }
    console.log(post.user.toString());
    if (post.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: "User not authorized" });
    }
    await post.remove();

    res.json({ msg: "POST DELETED" });
  } catch (error) {
    if (error.kind == "ObjectId") {
      return res.status(404).json({ msg: "post not found" });
    }
    return res.status(500).send("SERVER ERROR");
  }
});

// PUT /api/post/likes
// desc add a like
// type private

router.put("/likes/:id", auth, async (req, res) => {
  try {
    let post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ msg: "no post found" });
    }

    if (
      post.likes.filter((like) => like.user.toString() === req.user.id).length >
      0
    ) {
      return res.status(400).json({ msg: "ALREADY BEEN LIKE" });
    }

    post.likes.unshift({ user: req.user.id });

    await post.save();

    console.log(post.likes);

    return res.json(post.likes);
  } catch (error) {
    console.error(error.message);
    return res.status(500).send("SERVER ERROR");
  }
});

// DELETE /api/post/likes/:id
// desc remove a like
// type private

router.put("/unlike/:id", auth, async (req, res) => {
  try {
    let post = await Post.findById(req.params.id);

    if (
      post.likes.filter((like) => like.user.toString() === req.user.id)
        .length === 0
    ) {
      return res.status(400).json({ msg: "NOT BEEN LIKE YET" });
    }

    likes = post.likes;

    post.likes = post.likes.filter(
      (like) => like.user.toString() !== req.user.id
    );

    await post.save();

    console.log(post.likes);

    return res.json(post.likes);
  } catch (error) {
    console.error(error.message);
    return res.status(500).send("SERVER ERROR");
  }
});

// add /api/post/comment
// desc add a comment
// type private

router.put(
  "/comment/:id_post",
  [auth, [check("text", "Text is required").not().isEmpty()]],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const post = await Post.findById(req.params.id_post);
      console.log(req.user.id);
      console.log(post);

      if (!post) {
        return res.status(404).json({ msg: "NOT POST FOUND" });
      }
      console.log("khra");

      const user = await User.findById(req.user.id).select("-password");

      console.log(user);

      const newComment = {
        text: req.body.text,
        avatar: user.avatar,
        user: req.user.id,
        name: user.name,
      };

      post.comments.unshift(newComment);

      await post.save();

      res.json(post.comments);
    } catch (error) {
      console.error(error.message);
      return res.status(500).send("SERVER ERROR");
    }
  }
);

// DELETE /api/post/comment/:id_post
// desc add a comment
// type private

router.delete("/comment/:post_id/:comment_id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.post_id);

    const comment = post.comments.find(
      (comment) => comment.id === req.params.comment_id
    );

    if (!post) {
      return res.status(404).json({ msg: "NOT POST FOUND" });
    }

    if (
      post.comments.filter((comment) => comment.id === req.params.comment_id)
        .length == 0
    ) {
      return res.status(404).json({ msg: "COMMENT NOT FOUND" });
    }
    console.log("khra");
    if (comment.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: "User UnAuthorized" });
    }

    post.comments = post.comments.filter(
      (comment) => comment.id !== req.params.comment_id
    );

    await post.save();

    res.json(post.comments);
  } catch (error) {
    console.error(error.message);
    return res.status(500).send("SERVER ERROR");
  }
});

module.exports = router;
