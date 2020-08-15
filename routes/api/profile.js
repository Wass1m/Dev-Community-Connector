const express = require("express");

const router = express.Router();

const auth = require("../../middleware/auth");

const Profile = require("../../models/Profile");

const User = require("../../models/User");

const config = require("config");

const request = require("request");

const { check, validationResult } = require("express-validator");
const { route } = require("./user");

// get our current profile so we want api/profile/me
//private
router.get("/me", auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.user.id,
    }).populate("user", ["name", "avatar"]);
    if (!profile) {
      return res.status(400).json({ msg: "There is no profile for this user" });
    }
    res.json(profile);
  } catch (error) {
    console.error(error.message);
    return res.status(500).send("SERVER ERROR");
  }
});

/////

// POST api/profile
// create or update a userprofile

router.post(
  "/",
  [
    auth,
    [
      check("status", "Status is required").not().isEmpty(),
      check("skills", "Skills is required").not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
      });
    }

    const {
      company,
      location,
      website,
      bio,
      skills,
      status,
      githubusername,
      youtube,
      twitter,
      instagram,
      linkedin,
      facebook,
    } = req.body;

    // build profile object

    const profileFields = {};

    profileFields.user = req.user.id;
    if (company) profileFields.company = company;
    if (location) profileFields.location = location;
    if (website) profileFields.website = website;
    if (bio) profileFields.bio = bio;
    if (githubusername) profileFields.githubusername = githubusername;
    if (status) profileFields.status = status;
    if (skills)
      profileFields.skills = skills.split(",").map((skill) => skill.trim());

    profileFields.social = {};

    if (youtube) profileFields.social.youtube = youtube;
    if (twitter) profileFields.social.twitter = twitter;
    if (instagram) profileFields.social.instagram = instagram;
    if (linkedin) profileFields.social.linkedin = linkedin;
    if (facebook) profileFields.social.facebook = facebook;

    try {
      let profile = await Profile.findOne({ user: req.user.id });
      if (profile) {
        profile = await Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileFields },
          { new: true }
        );
      }

      //create

      profile = new Profile(profileFields);

      profile.save();

      return res.json(profile);
    } catch (error) {
      console.error(error.message);
      return res.status(500).send("SERVER ERROR");
    }
  }
);

// get all profile so we want api/profile
//public

router.get("/", async (req, res) => {
  try {
    let profiles = await Profile.find().populate("user", ["name", "avatar"]);

    res.json(profiles);
  } catch (error) {
    console.error(error.message);
    return res.status(500).send("SERVER ERROR");
  }
});

// get all profile so we want api/profile/user/user:id
// get profile by userid
//public

router.get("/user/:user_id", async (req, res) => {
  try {
    let profile = await Profile.findOne({
      user: req.params.user_id,
    }).populate("user", ["name", "avatar"]);
    if (!profile) {
      return res.status(400).json({ msg: "Profile not found" });
    }
    res.json(profile);
  } catch (error) {
    console.error(error.message);
    if (error.kind == "ObjectId") {
      return res.status(400).json({ msg: "Profile not found" });
    }
    return res.status(500).send("SERVER ERROR");
  }
});

// delete a user by id api/profile
//private

router.delete("/", auth, async (req, res) => {
  try {
    // todo remove posts

    await Profile.findByIdAndRemove({ user: req.user.id });

    await User.findByIdAndRemove({ _id: req.user.id });

    res.json({ msg: "USER DELETED" });
  } catch (error) {
    console.error(error.message);
    return res.status(500).send("SERVER ERROR");
  }
});

// PUT a user by id api/profile/experience
//private

router.put(
  "/experience",
  [
    auth,
    [
      check("title", "Title is required").not().isEmpty(),
      check("company", "Company is required").not().isEmpty(),
      check("from", "From date is required").not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      title,
      company,
      from,
      to,
      location,
      current,
      description,
    } = req.body;

    const newExperience = {
      title,
      company,
      from,
      to,
      location,
      current,
      description,
    };

    try {
      const profile = await Profile.findOne({ user: req.user.id });

      profile.experience.unshift(newExperience);

      await profile.save();
      res.json(profile);
    } catch (error) {
      console.error(error.message);
      return res.status(500).send("SERVER ERROR");
    }
  }
);

// delete a user by id api/profile/experience:id
//private

router.delete("/experience/:experience_id", auth, async (req, res) => {
  try {
    // todo remove posts

    let profile = await Profile.findOne({ user: req.user.id });

    profile.experience = profile.experience.filter(
      (exp) => exp._id != req.params.experience_id
    );

    await profile.save();

    res.json(profile);
  } catch (error) {
    console.error(error.message);
    return res.status(500).send("SERVER ERROR");
  }
});

// ADDING EDUCATION

router.put(
  "/education",
  [
    auth,
    [
      check("school", "School is required").not().isEmpty(),
      check("degree", "Degree is required").not().isEmpty(),
      check("fieldofstudy", "fieldofstudy date is required").not().isEmpty(),
      check("from", "From date is required").not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      school,
      degree,
      from,
      to,
      fieldofstudy,
      current,
      description,
    } = req.body;

    const newEd = {
      school,
      degree,
      from,
      to,
      fieldofstudy,
      current,
      description,
    };

    try {
      const profile = await Profile.findOne({ user: req.user.id });

      profile.education.unshift(newEd);

      await profile.save();
      res.json(profile);
    } catch (error) {
      console.error(error.message);
      return res.status(500).send("SERVER ERROR");
    }
  }
);

// delting education api/profile/education/:ed_id
// delete

router.delete("/education/:educ_id", auth, async (req, res) => {
  try {
    let profile = await Profile.findOne({ user: req.user.id });
    profile.education = profile.education.filter(
      (educ) => educ._id != req.params.educ_id
    );

    await profile.save();

    return res.json(profile);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("SERVER ERROR");
  }
});

// get github repo

router.get("/github/:username", (req, res) => {
  try {
    const options = {
      uri: `https://api.github.com/users/${
        req.params.username
      }/repos?per_page=6&sort=created&client_id=${config.get(
        "githubClientId"
      )}&client_secret=${config.get("githubSecret")}`,
      method: "GET",
      headers: { "user-agent": "node.js" },
    };
    request(options, (error, response, body) => {
      if (error) console.error(error);

      if (response.statusCode != 200) {
        return res.status(400).json({ msg: "Not github for this username" });
      }

      res.json(JSON.parse(body));
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("SERVER ERROR");
  }
});

module.exports = router;
