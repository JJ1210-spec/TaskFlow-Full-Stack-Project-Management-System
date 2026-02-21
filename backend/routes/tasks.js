import express from 'express'
import Task from '../models/task.js';
import Project from '../models/project.js';
import authMiddleware from '../middleware/auth.js';


const router = express.Router();

router.post('/',authMiddleware,async (req,res)=>{

    try
    {
        const {title,description,status,priority,deadline,projectId} = req.body;
        if (!projectId) {
            return res.status(400).json({ message: "Project ID is required" });
        }
        const project = await Project.findById(projectId);
         if(!project){
            return res.status(404).json({message:"Project not found"});
        }
        if (project.owner.toString()!==req.userId)
        {
            return res.status(403).json({message:"Not authorized to manage task from this userId"})
        }
    
       
        if(!title){
            return res.status(400).json({message:"All fields must be filled"});
        }    
        
      
        const newTask = new Task({title:title,description:description,status:status,priority:priority,deadline:deadline,project:projectId,createdBy:req.userId});
        await newTask.save();

        res.status(201).json({
            message:"Task created successfully",
            task:newTask
        });
        
    }

    catch(err){
        console.error(err);
        res.status(500).json({
            message:err.message
        })
    }


});


router.get('/project/:projectId',authMiddleware,async (req,res)=>{
    try{
        const projectId = req.params.projectId;

       
        const project = await Project.findById(projectId);
        if(!project){
            return res.status(404).json({message:"No such project exist"});
        }

        if(project.owner.toString()!==req.userId){
            return res.status(403).json({message:"Not Authorized to access this endpoint"});
        }

        const tasks = await Task.find({project:projectId});
        res.status(200).json({message:"Following tasks are found",tasks:tasks});

    }
    catch(err){
        res.status(500).json({message:"Error in get api",error:err.message});
    }
});


router.put('/:id',authMiddleware,async (req,res)=>{

    try{
    const taskId = req.params.id;
    const {title,description,status,priority,deadline} = req.body;
    if (!taskId){
        return res.status(404).json({message:"No such taskId exist"});
    }
     const task = await Task.findById(taskId);
    if(!task){
        return res.status(404).json({message:"No such task exist"});
    }

        const project = await Project.findById(task.project);
        if(!project){
            return res.status(404).json({message:"Project not found"});
        }


    if(project.owner.toString()!==req.userId){
        return res.status(403).json({message:"Not authorized to this endpoint"});
    }

   
    if(title!==undefined) task.title = title;
    if(description!==undefined) task.description = description;
    if(status!==undefined) task.status = status;
    if(priority!==undefined) task.priority = priority;
    if(deadline!==undefined) task.deadline = deadline;
    
    await task.save()

    return res.status(200).json({message:"Task updated successfully",task:task});
    }
    catch(err){
        res.status(500).json({message:"error in task updation",error:err.message});
    }

});

router.delete('/:id',authMiddleware,async (req,res)=>{
    try{
        const taskId = req.params.id;
        if(!taskId){
            return res.status(404).json({message:"TaskId not found"});
        }

        const task = await Task.findById(taskId);
        if(!task){
            return res.status(404).json({message:"No such task exist"});
        }

        
        const project = await Project.findById(task.project);
        if(!project){
            return res.status(404).json({message:"Project not found"});
        }

        if(project.owner.toString()!==req.userId)
            {
        return res.status(403).json({message:"Not authorized to this endpoint"});
        }

        await Task.findByIdAndDelete(taskId);

        return res.status(200).json({message:"Task deleted successfully"});
    }   

    catch(err){
        res.status(500).json({message:"error in task deletion",error:err.message});
    }
})

export default router;