const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/auth");

const app = express();

app.use(cors());
app.use(express.json()); // 👈 nhận application/json

app.get("/", async (req, res) => {
  return res.send("helll world");
});
app.use("/api/auth", authRoutes);

app.listen(3001, () => {
  console.log("Server running on http://localhost:3001");
});
