const express = require("express");

const router = express.Router();
const User = require("../../models/User");

const auth = require("../../middleware/auth");
const bcrypt = require("bcryptjs");

const jwt = require("jsonwebtoken");
const config = require("config");

const { check, validationResult } = require("express-validator");

router.get("/", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("server error");
  }
});

//POST request to api/auth, login a user
router.post(
  "/",
  [
    check("email", "please include a valid email").isEmail(),
    check("password", "is required").exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      let user = await User.findOne({ email });

      if (!user) {
        return res.status(400).json({
          errors: {
            msg: "Invalid credentials",
          },
        });
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(400).json({
          msg: "Invalid credentials",
        });
      }

      // id to sign

      const payload = {
        user: {
          id: user.id,
        },
      };

      // jwtwebtoken

      await jwt.sign(
        payload,
        config.get("jwtSecret"),
        { expiresIn: 36000 },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (error) {
      console.error(error.message);
      res.status(500).send("SERVEOR ERROR");
    }
  }
);

module.exports = router;
