const express = require("express");
const UserDetails = require("../../models/userDetails");
const { authenticateUserWithToken } = require("../../middlewares/jwtSrvice");

const router = express.Router();

/**
 * @route   POST /api/userdetails
 * @desc    Create new user details
 * @access  Public or Protected (based on your app)
 */
router.post("",authenticateUserWithToken, async (req, res) => {
  try {
    const { userId, name, phoneNumber, address, age, gender } = req.body;

    // ✅ Validate required fields
    if (!userId || !name) {
      return res
        .status(400)
        .json({ message: "userId, name, and email are required" });
    }

    // ✅ Check if user details already exist
    const existingUser = await UserDetails.findOne({ where: { userId } });
    if (existingUser) {
      return res
        .status(409)
        .json({ message: "User details already exist for this user" });
    }

    // ✅ Create a new record
    const newUserDetails = await UserDetails.create({
      userId,
      name,
      phoneNumber,
      address,
      age,
      gender,
    });

    // ✅ Send success response
    return res.status(201).json({
      message: "User details created successfully",
      data: newUserDetails,
    });
  } catch (error) {
    console.error("❌ Error creating user details:", error);
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
});

module.exports = router;
