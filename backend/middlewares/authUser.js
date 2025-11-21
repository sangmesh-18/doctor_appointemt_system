import jwt from 'jsonwebtoken'

const authUser = async (req,res,next) =>{
    try{
        const {token} = req.headers;
        if(!token){
            return res.status(401).json({
                message: 'Token not provided',
                success: false
             });
        }
        const decode = jwt.verify(token,process.env.JWT_SECRET_KEY);
        
        req.body.userId=decode.id;
        next();

    }catch(err){
        console.log(err.message);
        return res.status(401).json({
            message: 'Please login to book an appointment',
            success: false
        });
    }
}
export default authUser