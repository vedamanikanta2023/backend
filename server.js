const dotenv = require("dotenv");
const express = require("express");
const bcrypt=require("bcrypt");
const app = express();
const mysql = require("mysql2");
const cors = require("cors");
dotenv.config();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // For form-data bodies

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

db.connect((err) => {
  if (err) {
    console.log("Error while connecting to DB", err, "error end");
    return;
  }
  console.log("Connected to DB");
});

app.post("/user-register", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const keysOfBody = Object.keys(req.body);
    console.log("body", req.body, keysOfBody,new Date().toDateString(), "end body");

    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Hash password with bcrypt
    const hashedPassword = await bcrypt.hash(password, 10); // 10 = salt rounds

    db.query(
      `INSERT INTO users (username, email, password) VALUES (?, ?, ?)`,
      [username, email, hashedPassword],
      (err, result) => {
        if (err) {
          console.error("DB Error:", err);
          return res.status(500).json({ message: "Error in creating user" });
        }
        return res
          .status(201)
          .json({ message: "Created user successfully", userId: result.insertId });
      }
    );
  } catch (error) {
    console.error("Server error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

app.post("/login", (req, res) => {
  const { username, password } = req.body;
  console.log(`Login request @ ${new Date().toISOString()}`, req.body);

  const sqlQuery = `SELECT * FROM users WHERE username = ?`;

  db.query(sqlQuery, [username], async (err, result) => {
    if (err) {
      console.error("Error retrieving data from DB", err);
      return res.status(500).json({ message: "Internal server error" });
    }

    if (result.length === 0) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    const user = result[0];

    try {
      const isMatch = await bcrypt.compare(password, user.password); // check against hashed value
      if (!isMatch) {
        return res
          .status(401)
          .json({ message: "Invalid username or password" });
      }

      // Success ✅
      return res.status(200).json({
        message: "Login successful",
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
        },
      });
    } catch (err) {
      console.error("Error comparing password:", err);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
});
app.get("", (req, res) => {
  res.send("Hello");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`server running at ${PORT}`);
});
