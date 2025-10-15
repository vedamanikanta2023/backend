const dotenv = require("dotenv");
const express = require("express");
const bcrypt=require("bcrypt");
const app = express();
const cors = require("cors");
const jwt = require('jsonwebtoken');
const { generateJWTToken, verifyJWTToken, authenticateUserWithToken } = require("./middlewares/jwtSrvice");
// const { db } = require("./db");
const { getUserFromDB } = require("./services/userService");
const sequelize = require("./db");
const User = require("./models/users");
const UserDetails = require("./models/userDetails");
(async () => {
  try {
    await UserDetails.sync({ alter: true }); // creates or updates only this table
    console.log("✅ Category table created or updated successfully");
  } catch (err) {
    console.error("❌ Error creating table:", err);
  }
})();
dotenv.config();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // For form-data bodies

sequelize.sync()
.then(()=>console.log("Tables synced successfully"))
.catch(err=>console.log("Error syncing the tables: ",err));
// const db = mysql.createConnection({
//   host: process.env.DB_HOST,
//   user: process.env.DB_USER,
//   password: process.env.DB_PASSWORD,
//   database: process.env.D  B_NAME,
// });


// db.connect((err) => {
//   if (err) {
//     console.log("Error while connecting to DB", err, "error end");
//     return;
//   }
//   console.log("Connected to DB");
// });

app.get("/user/:id", async (req, res) => {
  const userId = req.params.id;
  const user = await getUserFromDB(userId);
  console.log("user",user)
  // 3. Store in cache with TTL = 60 seconds
  // await redisClient.setEx(`user:${userId}`, 60, JSON.stringify(user));

  res.status(200).json({ ...user });
});

app.post("/user-register", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const keysOfBody = Object.keys(req.body);

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
      const token=generateJWTToken();

      // Success ✅
      return res.status(200).json({
        message: "Login successful",
        user: {
          id: user.id,
          username: user.username,
          token,
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

app.post("/user/generateToken", (req, res) => {
    // Validate User Here
    // Then generate JWT Token

    let jwtSecretKey = process.env.JWT_SECRET_KEY;
    let data = {
        time: Date(),
        userId: 12,
    }

    const token = jwt.sign(data, jwtSecretKey);

    res.send(token);
});

app.get("/user/validateToken", (req, res) => {
    // Tokens are generally passed in header of request
    // Due to security reasons.

    let tokenHeaderKey = process.env.TOKEN_HEADER_KEY;
    let jwtSecretKey = process.env.JWT_SECRET_KEY;
    console.log(tokenHeaderKey,req.headers,"headers");
    try {
        const token = req.headers[tokenHeaderKey];

        console.log(token,"token");
        const verified = jwt.verify(token, jwtSecretKey);
        if (verified) {
            return res.send("Successfully Verified");
        } else {
            // Access Denied
            return res.status(401).send("Acess Denied");
        }
    } catch (error) {
        // Access Denied
        return res.status(401).send(` Access Denied.. ${error}`);
    }
});

const PORT = process.env.PORT || 3000;


// MySQL query to get all tables in the current database
async function db(){

  const [results, metadata] = await sequelize.query("SHOW TABLES");
  console.log("Tables in DB:", results);
}
db();
app.listen(PORT, () => {
  console.log(`server running at ${PORT}`);
});
