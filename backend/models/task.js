import mongoose from "mongoose";
import Project from "./project.js";
import User from "./User.js";

const taskSchema = new mongoose.Schema({
    title:{
    type: String,
    required:true
    },

    description:{
        type:String
    },

    status:{
        type:String,
        enum:['to_do','in_progress','done'],
        default:'to_do'
    },

    priority:{
        type:String,
        enum:['low','medium','high'],
        default:'medium'
    },
    deadline:{
        type: Date
    },

    project:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Project',
        required:true
    },

    createdBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    createdAt:{ 
        type:Date,
        default: Date.now
    }


});

const Task = mongoose.model('Task',taskSchema);
export default Task;