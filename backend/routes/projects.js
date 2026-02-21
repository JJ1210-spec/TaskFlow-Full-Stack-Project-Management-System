import express from 'express';
import authMiddleware  from '../middleware/auth.js';
import Project from '../models/project.js';
import mongoose from 'mongoose';

const router = express.Router();

router.post('/',authMiddleware,async (req,res)=>{
    try{
        const {name,description} = req.body;

        if (!name){
            return res.status(400).json({message:"Project name is required"});
        }
        const owner = req.userId
        const project = new Project(
            {name:name,
            description:description,
            owner:owner
            }
        );

        await project.save();

        return res.status(201).json({message:"Project Created",project:project});
    }
    catch(err){
        console.error(err);
        res.status(500).json({message:"error creating project",error:err.message});
    }
})

router.get('/',authMiddleware,async (req,res)=>{
    try{
    const owner = req.userId;
    const projects = await Project.find({owner:owner});

    return res.status(200).json({projects:projects});
    }
    catch(err){
        console.error({message:err.message});
        res.status(500).json({message:"get_projects_issue",error:err});
    }
})

router.put('/:id',authMiddleware,async (req,res)=>{
    try{
        const project = await Project.findById(req.params.id);
 
        if (!project){
            return res.status(404).json({message:"Project Not Found"});
        }
        if(project.owner.toString()!==req.userId){
            return res.status(403).json({message:"Invalid user"});
        }

        const {name,description} = req.body;
        if(name!==undefined) project.name = name;
        if(description!== undefined)project.description = description;

        await project.save();

        res.status(200).json({
            message:"Project updated successfully",
            project
        });

    }
    catch(err){
        console.error({message:err.message});
        res.status(500).json({message:"update_projects_issue",error:err})
    }
});

router.delete('/:id',authMiddleware,async (req,res)=>{
    try{
        const project = await Project.findById(req.params.id);
        if(!project){
            return res.status(404).json({message:"No such project exist"});
        }

        if(project.owner.toString()!==req.userId){
            return res.status(403).json({message:"Unauthorized User"});
        }

        await Project.findByIdAndDelete(req.params.id);
        return res.status(200).json({message:"project deleted successfully"});
    }
    catch(err){
        console.error(err);
        return res.status(500).json({message:"Project Deletion issue",error:err.message});
    }
})


router.get('/router',authMiddleware,(req,res)=>{
    const userId = req.userId;
})

router.post('/projects',authMiddleware,(req,res)=>{
    const userId = req.userId;
});

export default router;