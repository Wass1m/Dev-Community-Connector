const express = require("express");

const router = express.Router();

const User = require("../../models/User");

const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");

const jwt = require("jsonwebtoken");
const config = require("config");

const { check, validationResult } = require("express-validator");

//register a user
router.post(
  "/",
  [
    check("name", "Name is required").not().isEmpty(),
    check("email", "please include a valid email").isEmail(),
    check("password", "enter a password with 6 or more caracters").isLength({
      min: 6,
    }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;

    try {
      user = await User.findOne({ email });

      if (user) {
        return res.status(400).json({
          errors: {
            msg: "User already exists",
          },
        });
      }

      const avatar = gravatar.url(email, { s: "200", r: "pg", d: "mm" });

      user = new User({
        name,
        email,
        password,
        avatar,
      });

      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);

      // save into database
      await user.save();

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
