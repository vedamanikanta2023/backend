const { DataTypes } = require("sequelize");
const sequelize = require("../db");
const User = require("./users");

const UserDetails = sequelize.define("userDetails", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  age: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  phoneNumber: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  gender: {
    type: DataTypes.ENUM("Male", "Female", "Other"),
    allowNull: false,
  },
  address: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references:{
        model:User,
        key:"id"
    },
    onUpdate: "CASCADE",
    onDelete: "CASCADE",
  }
}, {
  tableName: "userDetails", // name in DB
  timestamps: true, // adds createdAt & updatedAt
});

// Association: one user → one userDetails
User.hasOne(UserDetails, { foreignKey: "userId" });
UserDetails.belongsTo(User, { foreignKey: "userId" });

module.exports = UserDetails;