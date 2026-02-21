import mongoose from 'mongoose';
import User from './User.js';

const projectSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },

    description:{
        type:String
        
    },

    owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:User,
        required:true
    },

    createdAt :{
        type:Date,
        default:Date.now
    }

});

const Project =mongoose.model('Project',projectSchema);
export default Project;