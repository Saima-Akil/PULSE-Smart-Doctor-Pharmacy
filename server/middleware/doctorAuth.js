import jwt from 'jsonwebtoken';

const doctorAuth=async (req,res,next)=>{
    const {token} = req.cookies;
    if(!token){
        return res.json({success:false,message:"Not Authorized, Login Again"})
    }
    try{
        const tokenDecode=jwt.verify(token,process.env.JWT_SECRET)
        if(tokenDecode.id){
            req.doctorId=tokenDecode.id
            req.user={id:tokenDecode.id}
          }else{
            return res.json({success:false,message:"Not Authorized, Login Again"})
          }
          next();

    }catch(error){
        console.log({success:true,message:error.message})
    }
}
export default doctorAuth