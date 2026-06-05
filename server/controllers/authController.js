const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const User = require("../models/User")

exports.register = async(req,res)=>{
    try{
        const{username, email, password} = req.body

        const existingUser = await User.findOne({email})
        if(existingUser){
            return res.status(400).json({message:"User already exists"})
        }

        const hashedPassword = await bcrypt.hash(password, 10)
        const newUser = new User({username,email, password: hashedPassword})
        await newUser.save()

        res.status(201).json({message:"user registered successfully"})
    }catch(err){
        res.status(500).json({message:"server error"})
    }
}

exports.login = async(req,res)=>{
    try{
        const{email, password}= req.body

        const user = await User.findOne({email})
        if(!user){
            return res.status(400).json({message:"user not found"})
        }

        const isMatch = await bcrypt.compare(password, user.password)
        if(!isMatch){
            return res.status(400).json({message:"invalid credentials"})
        }
        const token = jwt.sign({id:user._id},
            process.env.JWT_SECRET,
           {expiresIn:"7d",}
        )

        res.status(200).json({
            token,
            user:{ id:user._id,
                username:user.username,
                email:user.email
            },
        })
    }catch(err){
        res.status(500).json({message:"server error"})
    }
}
