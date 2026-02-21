import express from 'express'
import cors from 'cors'
import connectDB from './db.js';
import authRouter from './routes/auth.js';  
import projectRouter from './routes/projects.js';
import taskRouter from './routes/tasks.js';

const app = express();
app.use(express.json()); 
app.use(cors({
    origin:'http://localhost:5173'
})); 

connectDB();

app.post('/postcheck', async (req,res)=>{
    try{
    let {msg} = req.body;
    console.log(`received msg`,msg);
    msg=`Got the message`;
    res.json({message:msg});
    }
    catch(err){
        console.error({error:err});
    }
})

app.use('/api/auth', authRouter);
app.use('/api/projects',projectRouter);
app.use('/api/tasks',taskRouter);

app.listen(5000,()=>{
    console.log(`server at http://localhost:5000`);
})