const dotenv = require("dotenv");
const express = require("express");
const app = express();
const mysql = require("mysql2");
const cors = require("cors");
dotenv.config();

app.use(cors());
app.use(express.json());

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

app.post("/login", (req, res) => {
  const { username, password } = req.body;

  const sqlQuery = `SELECT * FROM users WHERE username = '${username}'`;

  db.query(sqlQuery, (err, result) => {
    if (err) {
      console.error("Error retrieving data from DB", err);
      return res.status(500).json({ message: "Internal server error" });
    }
    console.log("result", result);

    if (result.length === 0) {
      return res.status(401).json({ message: "Invalid username or password" });
    }
    const user = result[0];
    res.send(user);

    console.log("askdlj", result);
  });
  // res.send("")
});

app.get("", (req, res) => {
  res.send("Hello");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`server running at ${PORT}`);
});
