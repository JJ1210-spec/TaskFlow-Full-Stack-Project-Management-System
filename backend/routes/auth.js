import express from 'express'
import User from '../models/User.js'
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const router = express.Router();
const JWT_SECRET = 'MpM6CWhid7mRnL3tazOa7O43k74Db55FnnRIh6hW0DP';


router.post('/register', async(req,res)=>{
    try{
    const {name,email,password} = req.body; 
    
    if (!name || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }
   
    const users = await User.findOne({email});
    if (users){
        return res.json({message:"User already exist"});
    }
    else{
        const user = new User({
            name,email,password
        })

        await user.save();

        const token = jwt.sign({userId:user._id},JWT_SECRET,{expiresIn:'7d'})
        res.status(201).json({message:"User created Successfully",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                
                // Note: NOT sending password back!
            },
            token:token
        });
    }


    }
    catch(err){
        console.error("Error in registering",err);
        res.status(500).json({error:"Error in registration"});
    }
})


router.post('/login',async(req,res)=>{
    try{
        const {email,password} = req.body;
        if(!email || !password){
            return res.status(400).json({message:"All fields must be filled"});
        }
        const user = await User.findOne({email});
         
        if(!user){ 
           return res.status(400).json({message:"Invalid credentials"});
        }
       

        const isMatch = await bcrypt.compare(password,user.password);

                if(isMatch){
            const token=jwt.sign(
                
                    {userId:user._id},
                    JWT_SECRET,
                    {expiresIn:'7d'}
            )
            return res.status(200).json(
                {
                    message:"Login Successful",
                    user:{id:user._id,name:user.name,email:user.email},
                    token:token
                });
        }
        else{
            return res.status(401).json({message:"Invalid Credentials"});
        }

    }
    catch(err){
        console.error("Error in login",err);
        return res.status(500).json({error:"error in Login"});
    }
});




export default router;