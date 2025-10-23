const UserDetails = require("../models/userDetails");

const getUserDetailsFromDB = (id)=>{
  return new Promise(async(resolve,reject)=>{
    const userDetails = await UserDetails.findOne({where:{userId:id}});

    if(!!!userDetails){
      return reject({userDetials:undefined});
    };

    resolve(userDetails.toJSON());
  })
}

module.exports = { getUserDetailsFromDB };
