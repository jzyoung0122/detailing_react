const Admin=require("../models/Admin")
const textflow = require('textflow.js');
textflow.useKey(process.env.TEXTFLOW_API_KEY);

exports.login=async(req,res)=>{
    const {userName,password}=req.body
    const user=await Admin.findOne({userName})
    
    if(user){
        if(password==user.password){
            res.send(
                {flag:true,phone:user.phone}
            )
        }else{
            res.send({
                flag:false,
                message:`Sorry,the password doesn't match`
            })
        }        
    }else{
        res.send({
            flag:false,
            message:`This user doesn't exist `
        })
    }
}

exports.sendCode=async(req,res)=>{       
    const {phone}=req.body
    console.log(phone)
    const verificationOptions={
        service_name:`Haos garage`,
        seconds:600
    }
    await textflow.sendVerificationSMS(phone, verificationOptions);
    res.send()
}

exports.verifyCode=async(req,res)=>{
    const {phone,code}=req.body
    console.log(code)
    let result = await textflow.verifyCode(phone,code); 
    res.send(result.valid)

}