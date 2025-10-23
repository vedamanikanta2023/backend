const UserDetails = require("../models/userDetails");
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

const getUserDetailsFromDB = (id)=>{
  return new Promise(async(resolve,reject)=>{
    const userDetails = await UserDetails.findOne({where:{userId:id}});

    if(!!!userDetails){
      return reject({userDetials:undefined});
    };

    resolve(userDetails.toJSON());
  })
}

module.exports = { getUserFromDB, getUserDetailsFromDB };
