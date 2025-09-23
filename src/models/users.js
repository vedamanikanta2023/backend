const {DataTypes} = require("sequelize");
const {sequelize} = require("../db");

const User = sequelize.define("users",{
    id:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    username:{
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true
    },
    email:{
        type: DataTypes.STRING(100),
        allowNull:false,
        unique:false,
        validate:{
            isEmail:true
        }
    },
    password:{
        tyep: DataTypes.STRING(100),
        allowNull:false
    },
    role:{
        type:DataTypes.STRING(100),
        allowNull:false,
        defaultValue:"user"
    },
    createdAt:{
        type:DataTypes.DATE,
        default:DataTypes.NOW
    }
},{
    table:"users",
    timeStamps:false
});

module.exports = User;
