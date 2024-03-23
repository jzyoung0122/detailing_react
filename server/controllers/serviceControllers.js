const Service = require("../models/Services");
const Description=require("../models/Description")

exports.getServices=async(req,res)=>{
    const services= await Service.find()
    console
    res.send(services)
}

exports.getDescription=async(req,res)=>{
    // const title=req.body.title
    const list=await Description.find()

    if(list){
        res.send({
            flag:true,
            description:list
        })
    }else{
        res.send({
            flag:false,
            message:"sorry, we cannot show description right now"
        })
    }
}