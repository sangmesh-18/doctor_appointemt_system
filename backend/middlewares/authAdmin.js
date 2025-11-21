import jwt from 'jsonwebtoken'

const authAdmin = async (req,res,next) =>{
    try{
        const {atoken} = req.headers;
        if(!atoken){
            return res.status(404).json({
                message: 'Token not provided',
                success: false
             });
        }
        const decode = jwt.verify(atoken,process.env.JWT_SECRET_KEY);
        if(decode != process.env.ADMIN_EMAIL + process.env.ADMIN_PASSWORD) {
            return res.status(401).json({
                message: 'Token is not valid',
                success: false
             });
        }
        next();

    }catch(err){
        console.log(err.message);
    }
}
export default authAdmin