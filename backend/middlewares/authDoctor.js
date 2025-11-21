import jwt from 'jsonwebtoken'

const authDoctor = async (req,res,next) =>{
    try{
        const {dtoken} = req.headers;
        if(!dtoken){
            return res.status(404).json({
                message: 'Token not provided',
                success: false
             });
        }
        const decode = jwt.verify(dtoken,process.env.JWT_SECRET_KEY);
        req.body.docId=decode.id
        next();

    }catch(err){
        console.log(err.message)
        res.json({
            success: false,
            message: err.message
 
        })
    }
   
}
export default authDoctor