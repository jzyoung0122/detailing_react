const ChosenDate=require("../models/ChosenDate")
const Booking=require("../models/Booking")
const sgMail=require('@sendgrid/mail')
require('dotenv').config()
sgMail.setApiKey(process.env.SENDGRID_API_KEY)
const textflow = require('textflow.js');
textflow.useKey(process.env.TEXTFLOW_API_KEY);

function findConsecutiveGroups(nums, groupSize) {
    nums.sort((a, b) => a - b);
    const result = [];
    
    for (let i = 0; i < nums.length - groupSize + 1; i++) {
        let isConsecutive = true;
        for (let j = 1; j < groupSize; j++) {
            if (nums[i + j] !== nums[i + j - 1] + 1) {
                isConsecutive = false;
                break;
            }
        }      
        if (isConsecutive) {
            result.push(nums.slice(i, i + groupSize));
        }
    }
    
    return result;
}

const removePeriod=(period,time,totaltime)=>{
    let idx=0
    period.map((item,index)=>{
        if(item==time){
           idx= index
        }
      
    })
    console.log(idx)
    period.splice(idx,totaltime+1)
    return period

}

exports.getAvailableTime=async(req,res)=>{
    var chosenDate=new Date(req.body.date);
    const {totalTime}=req.body;   
    let available=true
    let availableTime=[] 
    
    const date=await ChosenDate.findOne({"date":chosenDate})
    if(!date){
        const newDate= await ChosenDate.create({
            date: chosenDate,
            ifAvailable: true,
            period:[0,1,2,3,4,5,6,7,8,9,10,11]
        })
        let availablePeriods=findConsecutiveGroups([0,1,2,3,4,5,6,7,8,9,10,11],Math.ceil(totalTime+1))
        if(availablePeriods.length>0){
            for(let period of availablePeriods){
                availableTime.push(period[0])
            }
        }else{
            available=false
        }
   
    }else{
        let availablePeriods=findConsecutiveGroups(date.period,Math.ceil(totalTime+1))
        if(availablePeriods.length>0){
            for(let period of availablePeriods){
                availableTime.push(period[0])
            }
        }else{
            available=false
        }        
    }
    const data={
        message:"success",
        flag:true,
        available:available,
        availableTime:availableTime
    }
    res.send(data)
}

exports.submitBooking=async(req,res)=>{
    let{date,time,timeForMailContent,serviceList,firstName,lastName,phoneNumber,email,address,totalTime,totalCost}=req.body
    let chosenDate =new Date(date)
    const availableTime=await ChosenDate.findOne({date:date})
    console.log(date)
    if(availableTime.period.includes(time)){
        const booking= await Booking.create({         
            time:time,
            date:chosenDate,
            serviceList:serviceList,
            firstName:firstName,
            lastName:lastName,
            phoneNumber:phoneNumber,
            email:email,
            address:{
             address1:address.address1,
             address2:address.address2,
             suburb:address.suburb,
             state:address.state,
             postCode:address.postCode
            },
            totalTime:totalTime,
            delete:false
         })
 
         //update available time
         const date= await ChosenDate.findOne({date:chosenDate})
         let period=date.period
        removePeriod(period,time,totalTime)
         await ChosenDate.updateOne({date:chosenDate},{period:period})
        
         let serviceContent='';
         for(let item of serviceList){
            let tmpContent='';
           
            for(let i=0;i<item.selected.length;i++){
                if(i==item.selected.length-1){
                    tmpContent +=item.selected[i].name 
                }else{
                    tmpContent=tmpContent+item.selected[i].name+','
                }                        
            }
             serviceContent=serviceContent+' '+tmpContent+` for ${item.type.toLowerCase()}.`
         }

         const msg = {
            to: email,
            from: 'jzyoung0122@gmail.com', // Use the email address or domain you verified above
            templateId: process.env.TEMPLATE_ID,
            dynamicTemplateData:{
                time:timeForMailContent,
                services:serviceContent,
                totalcost:totalCost 
            }
          };
          
          const sendMail=async () => {                 
              try {
                await sgMail.send(msg);
              } catch (error) {
                console.error(error);
            
                if (error.response) {
                  console.error(error.response.body)
                }
              }
          }

         sendMail()
         textflow.sendSMS("61404537609", "There is a new booking! Check it on your website ASAP.")
         res.send({message:"success",flag:true})

    }else{
        console.log("unavailable")
        res.send({message:"sorry,seems like the time has been chosen by someone else before you submit",
        flag:false})
        
    }
}

//Admin's actions
exports.getTimeByAdmin=async(req,res)=>{
    var chosenDate=new Date(req.body.date);

        let available=true
        let availableTime=[] 
        
        const date=await ChosenDate.findOne({"date":chosenDate})
        if(!date){
            const newDate= await ChosenDate.create({
                date: chosenDate,
                ifAvailable: true,
                period:[0,1,2,3,4,5,6,7,8,9,10,11]
            })
         availableTime=[0,1,2,3,4,5,6,7,8,9,10,11]
       
        }else{
            let availablePeriods=date.period
            if(availablePeriods.length>0){
                for(let period of availablePeriods){
                    availableTime.push(period)
                }
            }else{
                available=false
            }        
        }
        const data={
            message:"success",
            flag:true,
            available:available,
            availableTime:availableTime
        }
        res.send(data)
}

exports.getAllBookings=async(req,res)=>{
    let bookings=await Booking.find({})
    console.log(bookings)
    if(bookings.length!=0){
        console.log("send")
        res.send({
            message:"success",
            flag:true,
            bookings:bookings
        })
    }else{
        res.send({
            message:"no booking",
            flag:false
        })
    }
}

exports.setTimeUnavailable=async(req,res)=>{
    let chosenTime=req.body.chosenTime
    let chosenDate=req.body.date
    const date=await ChosenDate.findOne({date:chosenDate})
    const remainingTime=date.period.filter(item=>!chosenTime.includes(item))
    await ChosenDate.updateOne({date:chosenDate},{period:remainingTime})

    res.send({
     message:'success',
     flag:true
    })
 }

exports.getBookingsByMonths=async(req,res)=>{
    let month=req.body.month+1
    let year=req.body.year
    const bookings=await Booking.find({
        $expr: {
            $and: [
              { $eq: [{ $year: { $toDate: '$date' } }, year] },
              { $eq: [{ $month: { $toDate: '$date' } }, month] },
              { $eq: ['$delete',false] }
            ],
          },
    }).sort({date:-1,time:1})
    
    if(bookings.length!=0){
        // console.log(bookings)
        res.send({
            message:"success",
            flag:true,
            bookings:bookings
        })
    }else{
        // console.log(bookings)
        res.send({
            message:"no bookings",
            flag:false
        })
    }
}

exports.getBookingsByDates=async(req,res)=>{
    let date=new Date(req.body.date)
   
    const bookings=await Booking.find({
       date:date,
       delete:false
    }).sort({date:-1,time:1})
    if(bookings.length!=0){

        res.send({
            message:"success",
            flag:true,
            bookings:bookings
        })
    }else{
        // console.log(bookings)
        res.send({
            message:"no bookings",
            flag:false
        })
    }
}

exports.getBookingsByEmails=async(req,res)=>{
    let email=req.body.email
   
    const bookings=await Booking.find({
       email:email,
       delete:false
    }).sort({date:-1,time:1})
    if(bookings.length!=0){

        res.send({
            message:"success",
            flag:true,
            bookings:bookings
        })
    }else{
        // console.log(bookings)
        res.send({
            message:"no bookings",
            flag:false
        })
    }
}

exports.deleteBooking=async(req,res)=>{
    const id=req.body.id
    const booking=await Booking.findOneAndUpdate({_id:id},{delete:true})
    let time=booking.time

    const findeOneDate=await ChosenDate.findOne({date:new Date(booking.date)})
    let period=findeOneDate.period
    // console.log(findeOneDate.totalTime,period,time)      
    for(let i=0;i<Math.ceil(booking.totalTime+1);i++){
        period.push(time)
        time++   
    }
    period.sort(function(a, b){return a - b});
   
    await ChosenDate.updateOne({date:new Date(booking.date)},{period:period})
  
    res.send({
        flag:true
    })
}