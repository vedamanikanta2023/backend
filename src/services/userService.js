const User = require("../models/users");

const getUserFromDB = (id) => {
  return new Promise(async(resolve, reject) => {
    const user = await User.findOne({ where: { id } });

    if (!!!user) {
      return reject({message:"user not found"});
    }
    const cleanData = user.toJSON();
    delete cleanData.password;
    resolve(cleanData); 
  });
};

module.exports = { getUserFromDB };
