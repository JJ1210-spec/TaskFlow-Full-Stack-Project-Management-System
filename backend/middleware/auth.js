import jwt from 'jsonwebtoken';
const JWT_SECRET = 'MpM6CWhid7mRnL3tazOa7O43k74Db55FnnRIh6hW0DP'


const authMiddleware =(req,res,next)=>{
    const authHeader = req.header('Authorization');
    try{

    if(!authHeader){
         return res.status(401).json({message:'No Token provided'});
    }
    const token = authHeader.split(' ')[1];
    if (!token){
        return res.status(401).json({message:'Invalid token format'});
    }
    
    const decoded = jwt.verify(token,JWT_SECRET)
    req.userId = decoded.userId
    next();
    }
    catch(err){
        console.error('authMiddleware issues');
        res.status(400).json({message:err.message});
    }
   
}

export default authMiddleware;