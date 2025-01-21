const { error } = require("console");
const express = require("express");
const fs = require("fs");
const router = express.Router();

const filePath = "./data/library.json";

const readData = () => JSON.parse(fs.readFileSync(filePath, "utf-8"));
const writeData = (data) =>
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));

// All users
router.get("/", (req, res) => {
  const data = readData();
  res.json(data.user || []);
});

// new user
router.post("/", (req, res) => {
  const { name, email } = req.body;

  if (!name || !email) {
    return res.status(400).json({ error: "Name and email are required." });
  }

  const data = readData();
  data.users = data.users || [];
  const newUser = {
    id: Date.now(),
    name,
    email,
  };
  data.users.push(newUser);

  writeData(data);
  res.status(201).json(newUser);
});

// update user information

router.put("/:id", (req, res) => {
  const { id } = req.params;
  const { name, email } = req.body;

  const data = readData();
  const user = data.users.find((u) => u.id === Number.parseInt(id));

  if (!user) {
    return res.status(404).json({ error: "User not found." });
  }

  if (name) user.name = name;
  if (email) user.email = email;

  writeData(data);
  res.json(user);
});

// delete useer

router.delete("/:id", (req, res) => {
  const { id } = req.params;

  const data = readData();
  const filteredUsers = data.users.filter((u) => u.id !== Number.parseInt(id));

  if (data.users.length === filteredUsers.length) {
    return res.status(404).json({ error: "User not found" });
  }

  data.users = filteredUsers;
  writeData(data);
  res.status(204).send();
});

module.exports = router;
