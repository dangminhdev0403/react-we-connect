import bcrypt from "bcryptjs";
import cors from "cors";
import express from "express";
import jsonServer from "json-server";
import jwt from "jsonwebtoken";

const app = express();
const router = jsonServer.router("db.json");
app.db = router.db;

app.use(cors());
app.use(express.json());

// Secret key cho JWT (để demo, bạn nên lưu an toàn)
const ACCESS_TOKEN_SECRET = "youraccesstokensecret";
const REFRESH_TOKEN_SECRET = "yourrefreshtokensecret";

// Tạo access token
function generateAccessToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email, fullName: user.fullName },
    ACCESS_TOKEN_SECRET,
    { expiresIn: "15m" }
  );
}
app.post("/register", async (req, res) => {
  const { fullName, email, password } = req.body;

  if (!email || !password || !fullName) {
    return res
      .status(400)
      .json({ message: "Missing fullName, email or password" });
  }

  const users = app.db.get("users");
  const existingUser = users.find({ email }).value();

  if (existingUser) {
    return res.status(400).json({ message: "Email already exists" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = {
    id: Date.now(),
    fullName,
    email,
    password: hashedPassword,
  };

  users.push(newUser).write();

  const { password: _, ...userWithoutPass } = newUser;

  res
    .status(201)
    .json({ user: userWithoutPass, message: "User created successfully" });
});

// Tạo refresh token
function generateRefreshToken(user) {
  return jwt.sign({ id: user.id }, REFRESH_TOKEN_SECRET, { expiresIn: "7d" });
}

// Mảng lưu refresh token (demo, bạn nên lưu DB hoặc cache)
let refreshTokens = [];

// Custom login route
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ message: "Missing email or password" });

  const users = app.db.get("users");
  const user = users.find({ email }).value();

  if (!user)
    return res.status(401).json({ message: "Invalid email or password" });

  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword)
    return res.status(401).json({ message: "Invalid email or password" });

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  refreshTokens.push(refreshToken); // Lưu refresh token

  res.json({
    accessToken,
    refreshToken,
    user: {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
    },
    message: "Login successful",
  });
});

// Endpoint refresh token
app.post("/refresh-token", (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken)
    return res.status(401).json({ message: "Missing refresh token" });

  if (!refreshTokens.includes(refreshToken))
    return res.status(403).json({ message: "Invalid refresh token" });

  jwt.verify(refreshToken, REFRESH_TOKEN_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: "Invalid refresh token" });

    const newAccessToken = generateAccessToken(user);
    res.json({ accessToken: newAccessToken });
  });
});

// Xóa refresh token khi logout (tùy chọn)
app.post("/logout", (req, res) => {
  const { refreshToken } = req.body;
  refreshTokens = refreshTokens.filter((token) => token !== refreshToken);
  res.sendStatus(204);
});

app.use(router);

app.listen(3000, () => {
  console.log("Server running at http://localhost:3000");
});
