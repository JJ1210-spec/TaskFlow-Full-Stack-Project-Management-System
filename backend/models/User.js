import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
const userschema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true
    },
    password:{
        type:String,
        required:true,
        minLength:10
    },
    createdAt:{
        type:Date,
        default: Date.now
    }
});

userschema.pre('save',async function(){
    
    if(this.isModified('password')){
        this.password = await bcrypt.hash(this.password,10);
    }
  })  

const User = mongoose.model('User',userschema)

export default User;