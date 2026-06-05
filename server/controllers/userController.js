const User = require("../models/User")

exports.getAllUsers = async(req,res)=>{
    try{
        const users = await User.find({}, {password:0})
        res.status(200).json(users)
    }catch(err){
        res.status(500).json({message:"server error"})
    }
}