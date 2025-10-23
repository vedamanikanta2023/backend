const dotenv = require("dotenv");
const express = require("express");
const bcrypt = require("bcrypt");
const app = express();
const cors = require("cors");
const { generateJWTToken } = require("./middlewares/jwtSrvice");
const { getUserDetailsFromDB } = require("./services/userDetailsService");
const { getUserFromDB } = require("./services/userService");
const sequelize = require("./db");
// const createUpdateTables = require("./models/createModels"); to create new models/alter the tables uncomment this and callthis method //

const User = require("./models/users");

// if( process.env.ALTER_TABLES === true ){
//   createUpdateTables(process.env.ALTER_TABLES);
// }

dotenv.config();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // For form-data bodies

sequelize
  .sync()
  .then(() => console.log("Tables synced successfully"))
  .catch((err) => console.log("Error syncing the tables: ", err));

app.get("/user/:id", async (req, res) => {
  const userId = req.params.id;
  const user = await getUserFromDB(userId);

  res.status(200).json({ ...user });
});

app.get("/userdetails/:id", async (req, res) => {
  try {
    const userId = req.params.id;
    const userDetails = await getUserDetailsFromDB(userId); // example id
    console.log("User details:", userDetails);
    res.status(200).json({ ...userDetails });
  } catch (error) {
    return res.status(404).json({
      success: false,
      message: error.message || "User not found",
      data: null,
    });
  }
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
    const createUser = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    res.json(createUser);
  } catch (error) {
    console.error("Server error:", error);
    return res.status(500).json({ message: "Internal server error", error });
  }
});

app.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    // 1️⃣ Validate input
    if (!username || !password) {
      return res
        .status(400)
        .json({ message: "Username and password are required" });
    }

    // 2️⃣ Find user by username
    const user = await User.findOne({ where: { username } });

    if (!user) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    // 3️⃣ Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    // 4️⃣ Generate JWT token
    const token = generateJWTToken();

    // 5️⃣ Send response
    return res.status(200).json({
      message: "Login successful",
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        token,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

app.get("", (req, res) => {
  res.send("Hello");
});

const PORT = process.env.PORT || 3000;

// MySQL query to get all tables in the current database
async function dbTables() {
  const [results, metadata] = await sequelize.query("SHOW TABLES");
  console.log("Tables in DB:", results);
}

dbTables();
app.listen(PORT, () => {
  console.log(`server running at ${PORT}`);
});
