const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const router = express.Router();

const SECRET = "my_super_secret_key";

// fake user DB
const users = [
  {
    id: 1,
    email: "duong@gmail.com",
    password: bcrypt.hashSync("123456", 10),
  },
];

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ message: "Missing credentials" });

  const user = users.find((u) => u.email === email);
  if (!user) return res.status(401).json({ message: "Invalid email" });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(401).json({ message: "Invalid password" });

  const token = jwt.sign({ userId: user.id, email: user.email }, SECRET, {
    expiresIn: "3600",
  });

  res.json({ access_token: token });
});

router.get("/profile", (req, res) => {
  const auth = req.headers.authorization;

  if (!auth || !auth.startsWith("Bearer "))
    return res.status(401).json({ message: "Missing token" });

  const token = auth.split(" ")[1];

  try {
    const decoded = jwt.verify(token, SECRET);
    const expireAt = new Date(decoded.exp * 1000);
    console.log("Token expires at:", expireAt);

    res.json({ user: decoded });
    // res.status(401).send({ error: "het han token" });
  } catch {
    res.status(401).json({ message: "Invalid token" });
  }
});

module.exports = router;
