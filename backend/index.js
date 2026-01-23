console.log("user updated backend");

const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const app = express();
app.use(cors());
app.use(express.json());

const users = [];
const tasks = [];
const JWT_SECRET = "supersecretkey";

// Auth middleware
function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    return res.status(401).json({ message: "Invalid token" });
  }
}

app.get("/", (req, res) => {
  res.send("Backend is running");
});

// Register
app.post("/register", async (req, res) => {
  const { email, password } = req.body;

  const existing = users.find((u) => u.email === email);
  if (existing) {
    return res.status(400).json({ message: "User already exists" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  users.push({ email, password: hashedPassword });

  res.json({ message: "User registered successfully" });
});

// Login
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = users.find((u) => u.email === email);
  if (!user) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  const token = jwt.sign({ email: user.email }, JWT_SECRET, {
    expiresIn: "1h",
  });

  res.json({ token });
});

// Profile
app.get("/profile", authMiddleware, (req, res) => {
  const user = users.find((u) => u.email === req.user.email);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  res.json({ email: user.email });
});

// Get tasks
app.get("/tasks", authMiddleware, (req, res) => {
  const userTasks = tasks.filter((task) => task.email === req.user.email);
  res.json(userTasks);
});

// Create task
app.post("/tasks", authMiddleware, (req, res) => {
  const { title } = req.body;

  const newTask = {
    id: Date.now(),
    email: req.user.email,
    title,
    completed: false,
  };

  tasks.push(newTask);
  res.json(newTask);
});

// Toggle complete
app.patch("/tasks/:id", authMiddleware, (req, res) => {
  const id = Number(req.params.id);

  const task = tasks.find((t) => t.id === id && t.email === req.user.email);

  if (!task) {
    return res.status(404).json({ message: "Task not found" });
  }

  task.completed = !task.completed;
  res.json(task);
});

// Delete task
app.delete("/tasks/:id", authMiddleware, (req, res) => {
  const id = Number(req.params.id);

  const index = tasks.findIndex(
    (t) => t.id === id && t.email === req.user.email,
  );

  if (index === -1) {
    return res.status(404).json({ message: "Task not found" });
  }

  tasks.splice(index, 1);
  res.json({ message: "Task deleted" });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
