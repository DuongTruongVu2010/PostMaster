const express = require("express");
const router = express.Router();
const { Users } = require("../models");
const bcrypt = require("bcrypt");
const { validateToken } = require("../middlewwares/AuthMiddleware");

const { sign } = require("jsonwebtoken");

router.post("/", async (req, res) => {
  const { username, password } = req.body;
  await bcrypt.hash(password, 10).then((hash) => {
    Users.create({
      username: username,
      password: hash,
    });
    res.json("success");
  });
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  const user = await Users.findOne({ where: { username: username } });
  if (!user) res.json({ error: "User not found" });

  bcrypt.compare(password, user.password).then(async (match) => {
    if (!match) res.json({ error: "Password mismatch" });

    const accessToken = sign(
      {
        username: user.username,
        id: user.id,
      },
      "importantsecret"
    );

    res.json({ token: accessToken, username: username, id: user.id });
  });
});

router.get("/auth", validateToken, (req, res) => {
  res.json(req.user);
});

router.get("/basicinfo/:id", async (req, res) => {
  const userId = req.params.id;

  const basicInfo = await Users.findByPk(userId, {
    attributes: { exclude: ["password"] },
  });
  res.json(basicInfo);
});
router.put("/changepassword", validateToken, async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const user = await Users.findOne({ where: { username: req.user.username } });

  bcrypt.compare(oldPassword, user.password).then(async (match) => {
    if (!match) res.json({ error: "wrong password entered" });

    bcrypt.hash(newPassword, 10).then((hash) => {
      Users.update(
        { password: hash },
        { where: { username: req.user.username } }
      );
      res.json("success");
    });
  });
});

module.exports = router;
